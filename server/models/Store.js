import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    customCategories: { type: Array, default: [] },
    itemsByCategory: { type: mongoose.Schema.Types.Mixed, default: {} },
    sales: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
