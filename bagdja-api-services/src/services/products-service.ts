import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

/**
 * PRODUCTS SERVICE
 * Handles public product browsing and protected CRUD operations
 */

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List Published Products
 *     description: Fetch all published products with optional filtering and pagination
 *     tags: [Products (Public)]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of products to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of products to skip
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, limit = '20', offset = '0', search } = req.query;

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        stock,
        image_url,
        images,
        is_featured,
        created_at,
        category:categories(id, name, slug)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Filter by category if provided
    if (category) {
      query = query.eq('category_id', category as string);
    }

    // Search by name if provided
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data: products, error, count } = await query;

    if (error) {
      res.status(500).json({
        error: 'Database Error',
        message: error.message
      });
      return;
    }

    res.json({
      products: products || [],
      pagination: {
        total: count || products?.length || 0,
        limit: limitNum,
        offset: offsetNum
      }
    });
  } catch (error: any) {
    console.error('Fetch products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get Product by Slug
 *     description: Fetch detailed information for a single published product
 *     tags: [Products (Public)]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product URL slug
 *         example: wireless-headphones
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        owner:users(id, full_name, email)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !product) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
      return;
    }

    res.json({ product });
  } catch (error: any) {
    console.error('Fetch product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// ============================================================================
// PROTECTED ROUTES (Developer/Admin only)
// ============================================================================

/**
 * @swagger
 * /api/products/developer/my-products:
 *   get:
 *     summary: Get My Products
 *     description: Fetch all products owned by the authenticated developer
 *     tags: [Products (Developer)]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of developer's products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Requires Developer or Admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/developer/my-products',
  authenticateToken,
  requireRole(['Developer', 'Admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          error: 'Database Error',
          message: error.message
        });
        return;
      }

      res.json({ products: products || [] });
    } catch (error: any) {
      console.error('Fetch my products error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/products/developer/products:
 *   post:
 *     summary: Create Product
 *     description: Create a new product (owner_id automatically set to authenticated user)
 *     tags: [Products (Developer)]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: Wireless Headphones
 *             slug: wireless-headphones
 *             description: Premium wireless headphones with noise cancellation
 *             price: 99.99
 *             stock: 50
 *             categoryId: 123e4567-e89b-12d3-a456-426614174000
 *             imageUrl: https://example.com/image.jpg
 *             status: published
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Requires Developer or Admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Product slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/developer/products',
  authenticateToken,
  requireRole(['Developer', 'Admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { name, slug, description, price, stock, categoryId, imageUrl, images, status } = req.body;

      // Validation
      if (!name || !slug || !price || !categoryId) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Required fields: name, slug, price, categoryId'
        });
        return;
      }

      // Create product with owner_id set to authenticated user
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          owner_id: userId, // OWNER ISOLATION: Auto-set to authenticated user
          category_id: categoryId,
          name,
          slug,
          description: description || null,
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          image_url: imageUrl || null,
          images: images || [],
          status: status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          res.status(409).json({
            error: 'Conflict',
            message: 'Product with this slug already exists'
          });
          return;
        }

        res.status(500).json({
          error: 'Database Error',
          message: error.message
        });
        return;
      }

      res.status(201).json({ product });
    } catch (error: any) {
      console.error('Create product error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/products/developer/products/{id}:
 *   put:
 *     summary: Update Product
 *     description: Update an existing product (only if owned by authenticated user)
 *     tags: [Products (Developer)]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               imageUrl:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *           example:
 *             name: Updated Product Name
 *             price: 89.99
 *             stock: 100
 *             status: published
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner or wrong role
 *       404:
 *         description: Product not found
 */
router.put(
  '/developer/products/:id',
  authenticateToken,
  requireRole(['Developer', 'Admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updateData = req.body;

      // OWNER ISOLATION: Verify product belongs to authenticated user
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError || !existingProduct) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Product not found'
        });
        return;
      }

      if (existingProduct.owner_id !== userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own products'
        });
        return;
      }

      // Prevent changing owner_id
      delete updateData.owner_id;
      delete updateData.id;
      delete updateData.created_at;

      // Update product
      const { data: product, error } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        res.status(500).json({
          error: 'Database Error',
          message: error.message
        });
        return;
      }

      res.json({ product });
    } catch (error: any) {
      console.error('Update product error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/products/developer/products/{id}:
 *   delete:
 *     summary: Delete Product
 *     description: Delete a product (only if owned by authenticated user)
 *     tags: [Products (Developer)]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner or wrong role
 *       404:
 *         description: Product not found
 */
router.delete(
  '/developer/products/:id',
  authenticateToken,
  requireRole(['Developer', 'Admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // OWNER ISOLATION: Verify product belongs to authenticated user
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError || !existingProduct) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Product not found'
        });
        return;
      }

      if (existingProduct.owner_id !== userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You can only delete your own products'
        });
        return;
      }

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        res.status(500).json({
          error: 'Database Error',
          message: error.message
        });
        return;
      }

      res.json({
        message: 'Product deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete product error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/products/categories/list:
 *   get:
 *     summary: List Categories
 *     description: Fetch all active product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categories/list', async (_req: Request, res: Response) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      res.status(500).json({
        error: 'Database Error',
        message: error.message
      });
      return;
    }

    res.json({ categories: categories || [] });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

export default router;

