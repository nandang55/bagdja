import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface ApiKeyRequest extends Request {
  apiKey?: {
    id: string;
    projectId: string;
    name: string;
    permissions: string[];
    userId?: string;
  };
}

/**
 * Middleware to validate API Keys for external integrations
 * Supports apps with their own auth system
 */
export const validateApiKey = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'API key required. Use X-API-Key header.'
      });
      return;
    }

    // Validate API key from database
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !keyData) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or inactive API key'
      });
      return;
    }

    // Check expiration
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'API key has expired'
      });
      return;
    }

    // Attach API key info to request
    req.apiKey = {
      id: keyData.id,
      projectId: keyData.project_id,
      name: keyData.name,
      permissions: keyData.permissions || [],
      userId: keyData.user_id
    };

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id);

    next();
  } catch (error: any) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error validating API key'
    });
  }
};

/**
 * Middleware to support both JWT and API Key authentication
 * Flexible for different integration levels
 */
export const flexibleAuth = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  // Try JWT first (Level 1: Full Integration)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Import from auth middleware
    const { authenticateToken } = await import('./auth');
    return authenticateToken(req, res, next);
  }

  // Try API Key (Level 2 & 3: Linked/API-only)
  if (apiKey) {
    return validateApiKey(req, res, next);
  }

  // No auth provided
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication required. Use Bearer token or X-API-Key header.'
  });
};

