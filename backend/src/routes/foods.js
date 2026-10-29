const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/Food');

const router = express.Router();
function normalizeVietnamese(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
const catchAsync = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normalizeFood(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Dữ liệu món ăn phải là đối tượng JSON.' };
  }
  const fields = ['foodId', 'name', 'category', 'cuisine', 'description'];
  const value = {};
  for (const field of fields) {
    if (typeof input[field] !== 'string' || !input[field].trim()) {
      return { error: `Trường ${field} phải là chuỗi không rỗng.` };
    }
    value[field] = input[field].trim();
  }
  if (!Array.isArray(input.ingredients) || input.ingredients.length === 0 ||
      input.ingredients.some(x => typeof x !== 'string' || !x.trim())) {
    return { error: 'ingredients phải là danh sách các nguyên liệu không rỗng.' };
  }
  value.ingredients = input.ingredients.map(x => x.trim());
  if (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price < 0) {
    return { error: 'price phải là số >= 0.' };
  }
  if (typeof input.quantity !== 'number' || !Number.isInteger(input.quantity) || input.quantity < 0) {
    return { error: 'quantity phải là số nguyên >= 0.' };
  }
  value.price = input.price;
  value.quantity = input.quantity;
  if (input.imageUrl === undefined || input.imageUrl === null || input.imageUrl === '') {
    value.imageUrl = '';
  } else if (typeof input.imageUrl === 'string' && /^https?:\/\//i.test(input.imageUrl.trim())) {
    value.imageUrl = input.imageUrl.trim();
  } else {
    return { error: 'imageUrl phải là URL http(s) hợp lệ hoặc để trống.' };
  }
  return { value };
}

function requireObjectId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: 'MongoDB _id không hợp lệ.' });
  }
  next();
}


router.get('/', catchAsync(async (req, res) => {
  const search = String(req.query.search || '').trim();

  if (search.length > 100) {
    return res.status(400).json({
      message: 'Từ khóa tìm kiếm quá dài.'
    });
  }

  const foods = await Food.find().sort({ createdAt: -1 });

  if (!search) {
    return res.json(foods);
  }

  const keyword = normalizeVietnamese(search);

  const results = foods.filter(food =>
    ['name', 'category', 'cuisine'].some(field =>
      normalizeVietnamese(food[field]).includes(keyword)
    )
  );

  res.json(results);
}));


router.get('/:id', requireObjectId, catchAsync(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn.' });
  res.json(food);
}));

router.post('/', catchAsync(async (req, res) => {
  const { value, error } = normalizeFood(req.body);
  if (error) return res.status(400).json({ message: error });
  const food = await Food.create(value);
  res.status(201).json(food);
}));

router.put('/:id', requireObjectId, catchAsync(async (req, res) => {
  const { value, error } = normalizeFood(req.body);
  if (error) return res.status(400).json({ message: error });
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn.' });
  Object.assign(food, value);
  await food.save(); // Có validate và kiểm tra unique index foodId
  res.json(food);
}));

router.delete('/:id', requireObjectId, catchAsync(async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn.' });
  res.json({ message: 'Đã xóa món ăn.', foodId: food.foodId });
}));

module.exports = router;
