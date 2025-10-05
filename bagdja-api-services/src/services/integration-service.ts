import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';
import crypto from 'crypto';

const router = Router();

/**
 * INTEGRATION SERVICE
 * Handles external app integrations with flexible auth levels
 */

/**
 * @swagger
 * /api/integration/generate-api-key:
 *   post:
 *     summary: Generate API Key
 *     description: Generate API key for external app integration (Level 2/3)
 *     tags: [Integration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name for this API key
 *                 example: my-porto-integration
 *               projectId:
 *                 type: string
 *                 description: External project identifier
 *                 example: my-porto
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["read:products", "write:orders"]
 *               expiresInDays:
 *                 type: integer
 *                 description: Days until expiration (0 = never)
 *                 example: 365
 *     responses:
 *       201:
 *         description: API key generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   example: bgdj_sk_1234567890abcdef...
 *                 message:
 *                   type: string
 *                   example: API key generated. Save it securely - it won't be shown again.
 */
router.post('/generate-api-key', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, projectId, permissions = [], expiresInDays = 0 } = req.body;

    if (!name || !projectId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Required fields: name, projectId'
      });
      return;
    }

    // Generate secure API key
    const apiKey = 'bgdj_sk_' + crypto.randomBytes(32).toString('hex');

    // Calculate expiration
    const expiresAt = expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    // Store in database (you'll need to create api_keys table)
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        project_id: projectId,
        name,
        key_hash: apiKey,
        permissions,
        expires_at: expiresAt,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({
        error: 'Database Error',
        message: error.message
      });
      return;
    }

    res.status(201).json({
      apiKey,
      keyId: data.id,
      projectId,
      permissions,
      expiresAt,
      message: '⚠️ Save this API key securely. It will not be shown again.'
    });
  } catch (error: any) {
    console.error('Generate API key error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/integration/validate-integration:
 *   post:
 *     summary: Validate Integration Token
 *     description: Validate token from external app (supports both JWT and API Key)
 *     tags: [Integration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token or API key
 *               projectId:
 *                 type: string
 *                 example: my-porto
 *     responses:
 *       200:
 *         description: Token validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 integrationType:
 *                   type: string
 *                   enum: [full, linked, api-only]
 *                 user:
 *                   type: object
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/validate-integration', async (req: Request, res: Response) => {
  try {
    const { token, projectId } = req.body;

    // Check if it's an API key or JWT
    if (token.startsWith('bgdj_sk_')) {
      // Level 2/3: API Key
      const { data: keyData } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_hash', token)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .single();

      if (!keyData) {
        res.status(401).json({ valid: false, message: 'Invalid API key' });
        return;
      }

      res.json({
        valid: true,
        integrationType: keyData.user_id ? 'linked' : 'api-only',
        projectId: keyData.project_id,
        permissions: keyData.permissions,
        userId: keyData.user_id
      });
    } else {
      // Level 1: JWT Token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

      res.json({
        valid: true,
        integrationType: 'full',
        user: {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role
        }
      });
    }
  } catch (error: any) {
    res.status(401).json({
      valid: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/integration/my-keys:
 *   get:
 *     summary: List My API Keys
 *     description: Get all API keys created by authenticated user
 *     tags: [Integration]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKeys:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                       permissions:
 *                         type: array
 *                       createdAt:
 *                         type: string
 *                       lastUsedAt:
 *                         type: string
 *                       expiresAt:
 *                         type: string
 */
router.get('/my-keys', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, project_id, permissions, created_at, last_used_at, expires_at, is_active')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({
        error: 'Database Error',
        message: error.message
      });
      return;
    }

    res.json({
      apiKeys: keys?.map(key => ({
        id: key.id,
        name: key.name,
        projectId: key.project_id,
        permissions: key.permissions,
        isActive: key.is_active,
        createdAt: key.created_at,
        lastUsedAt: key.last_used_at,
        expiresAt: key.expires_at
      })) || []
    });
  } catch (error: any) {
    console.error('Fetch API keys error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/integration/revoke-key/{keyId}:
 *   delete:
 *     summary: Revoke API Key
 *     description: Deactivate an API key
 *     tags: [Integration]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: API key revoked
 */
router.delete('/revoke-key/:keyId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { keyId } = req.params;

    // Verify ownership
    const { data: key, error: fetchError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('id', keyId)
      .single();

    if (fetchError || !key || key.user_id !== userId) {
      res.status(404).json({
        error: 'Not Found',
        message: 'API key not found or unauthorized'
      });
      return;
    }

    // Deactivate key
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId);

    if (error) {
      res.status(500).json({
        error: 'Database Error',
        message: error.message
      });
      return;
    }

    res.json({
      message: 'API key revoked successfully'
    });
  } catch (error: any) {
    console.error('Revoke API key error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

export default router;

