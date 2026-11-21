import { Router } from 'express';
import Store from '../models/Store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  let store = await Store.findOne({ owner: req.userId });
  if (!store) store = await Store.create({ owner: req.userId });
  res.json({
    customCategories: store.customCategories,
    itemsByCategory: store.itemsByCategory,
    sales: store.sales,
  });
});

router.put('/', async (req, res) => {
  const { customCategories, itemsByCategory, sales } = req.body;
  if (!Array.isArray(customCategories) || !itemsByCategory || typeof itemsByCategory !== 'object' || !Array.isArray(sales)) {
    return res.status(400).json({ error: 'Invalid store data.' });
  }

  const store = await Store.findOneAndUpdate(
    { owner: req.userId },
    { customCategories, itemsByCategory, sales },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({
    customCategories: store.customCategories,
    itemsByCategory: store.itemsByCategory,
    sales: store.sales,
  });
});

export default router;
