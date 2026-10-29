require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const foodRoutes = require('./routes/foods');
const Food = require('./models/Food');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8080')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin(origin, done) {
  if (!origin || allowedOrigins.includes(origin)) return done(null, true);
  return done(new Error('CORS_NOT_ALLOWED'));
} }));

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable', database: connected ? 'connected' : 'disconnected'
  });
});
app.use('/api/foods', foodRoutes);
app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy endpoint.' }));
app.use((err, req, res, next) => {
  if (err.message === 'CORS_NOT_ALLOWED') return res.status(403).json({ message: 'CORS: origin không được phép.' });
  if (err.code === 11000) return res.status(409).json({ message: 'Mã foodId đã tồn tại.' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', details: err.message });
  }
  console.error('Lỗi API:', err);
  res.status(500).json({ message: 'Lỗi máy chủ hoặc cơ sở dữ liệu.' });
});

async function start() {
  if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
    throw new Error('Thiếu MONGODB_URI hoặc DB_NAME trong biến môi trường.');
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    serverSelectionTimeoutMS: 10000
  });
  await Food.init(); // đảm bảo unique index foodId đã sẵn sàng
  console.log('MongoDB Atlas: connected');
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, '0.0.0.0', () => console.log(`API: http://localhost:${port}`));
}
start().catch(err => { console.error('Không thể khởi động backend:', err.message); process.exit(1); });
