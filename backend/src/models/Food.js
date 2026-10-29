const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    ingredients: { type: [String], required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true, collection: 'foods', versionKey: false }
);

module.exports = mongoose.model('Food', foodSchema);
