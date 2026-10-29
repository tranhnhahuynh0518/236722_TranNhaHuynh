import React, { useEffect, useState } from 'react';

const API = (window.__APP_CONFIG__?.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const EMPTY = { foodId: '', name: '', category: '', cuisine: '', ingredients: '', price: '', quantity: '', description: '', imageUrl: '' };
const money = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API}${path}`, options);
  } catch {
    throw new Error('Không kết nối được backend. Kiểm tra API_BASE_URL, Render và CORS.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `HTTP ${response.status}`);
  return payload;
}

export default function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadFoods(keyword = '') {
    setLoading(true); setError('');
    try {
      const data = await request(`/api/foods${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`);
      setFoods(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadFoods(); }, []);

  function resetForm() { setEditingId(null); setForm(EMPTY); }
  function editFood(food) {
    setEditingId(food._id);
    setForm({ ...food, ingredients: food.ingredients.join(', '), price: String(food.price), quantity: String(food.quantity), imageUrl: food.imageUrl || '' });
    setNotice('Đang sửa món: ' + food.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function showDetail(id) {
    setError('');
    try { setDetail(await request(`/api/foods/${id}`)); }
    catch (e) { setError(e.message); }
  }
  async function submitForm(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    const payload = {
      foodId: form.foodId, name: form.name, category: form.category, cuisine: form.cuisine,
      ingredients: form.ingredients.split(',').map(x => x.trim()).filter(Boolean),
      price: Number(form.price), quantity: Number(form.quantity),
      description: form.description, imageUrl: form.imageUrl
    };
    try {
      const isEditing = Boolean(editingId);
      await request(isEditing ? `/api/foods/${editingId}` : '/api/foods', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      resetForm(); setNotice(isEditing ? 'Cập nhật món ăn thành công.' : 'Thêm món ăn thành công.');
      await loadFoods(activeSearch);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }
  async function removeFood(food) {
    if (!window.confirm(`Xóa món "${food.name}"?`)) return;
    setError(''); setNotice('');
    try {
      await request(`/api/foods/${food._id}`, { method: 'DELETE' });
      if (editingId === food._id) resetForm();
      setNotice('Xóa món ăn thành công.');
      await loadFoods(activeSearch);
    } catch (e) { setError(e.message); }
  }
  const setField = (name, value) => setForm(f => ({ ...f, [name]: value }));
  const submitSearch = e => { e.preventDefault(); const keyword = search.trim(); setActiveSearch(keyword); loadFoods(keyword); };
  return (
    <div className="page">
      <header className="header">
        <div className="brand-icon">🍜</div>
        <div><div className="eyebrow">CLOUD COMPUTING LAB</div><h1>Food Cloud <span>Manager</span></h1><p>Quản lý món ăn trực tuyến · MongoDB Atlas</p></div>
        <div className="api-state">API: {API.replace(/^https?:\/\//, '')}</div>
      </header>
      <section className="stats">
        <div><span>TỔNG SỐ MÓN</span><strong>{foods.length}</strong><small>{activeSearch ? 'Trong kết quả tìm kiếm' : 'Đang hiển thị'}</small></div>
        <div><span>GIÁ TRỊ TỒN KHO</span><strong>{money(foods.reduce((sum, f) => sum + f.price * f.quantity, 0))}</strong><small>Tính từ danh sách hiển thị</small></div>
        <div><span>TRẠNG THÁI</span><strong className="status">● {error ? 'Cần kiểm tra' : loading ? 'Đang tải...' : 'Sẵn sàng'}</strong><small>API & danh sách món ăn</small></div>
      </section>
      {error && <div className="alert error" role="alert">⚠️ {error}</div>}
      {notice && <div className="alert success" role="status">✓ {notice}</div>}
      <main className="layout">
        <section className="panel form-panel">
          <div className="panel-head"><div><div className="eyebrow">QUẢN LÝ DỮ LIỆU</div><h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2></div><span>✦</span></div>
          <form onSubmit={submitForm}>
            <div className="field-row">
              <label>Mã món ăn *<input required value={form.foodId} onChange={e => setField('foodId', e.target.value)} placeholder="F004" /></label>
              <label>Tên món ăn *<input required value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Bún bò Huế" /></label>
            </div>
            <div className="field-row">
              <label>Loại món *<input required value={form.category} onChange={e => setField('category', e.target.value)} placeholder="Món nước" /></label>
              <label>Ẩm thực / vùng miền *<input required value={form.cuisine} onChange={e => setField('cuisine', e.target.value)} placeholder="Miền Trung" /></label>
            </div>
            <label>Nguyên liệu (cách nhau bằng dấu phẩy) *<input required value={form.ingredients} onChange={e => setField('ingredients', e.target.value)} placeholder="Bún, thịt bò, sả" /></label>
            <div className="field-row">
              <label>Giá bán (VND) *<input type="number" min="0" step="1" required value={form.price} onChange={e => setField('price', e.target.value)} placeholder="45000" /></label>
              <label>Số lượng *<input type="number" min="0" step="1" required value={form.quantity} onChange={e => setField('quantity', e.target.value)} placeholder="20" /></label>
            </div>
            <label>Mô tả *<textarea required rows="3" value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Giới thiệu món ăn..." /></label>
            <label>Đường dẫn ảnh (không bắt buộc)<input type="url" value={form.imageUrl} onChange={e => setField('imageUrl', e.target.value)} placeholder="https://..." /></label>
            <div className="form-actions"><button className="primary" disabled={saving}>{saving ? 'Đang lưu...' : editingId ? 'Lưu cập nhật' : '+ Thêm món ăn'}</button><button type="button" className="secondary" onClick={resetForm}>Làm mới</button></div>
          </form>
        </section>
        <section className="panel list-panel">
          <div className="panel-head"><div><div className="eyebrow">DANH SÁCH MÓN ĂN</div><h2>Thực đơn của bạn</h2></div><span className="count">{foods.length} món</span></div>
          <form className="search" onSubmit={submitSearch}><input aria-label="Tìm món ăn" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, loại món, vùng miền..."/><button className="primary" type="submit">Tìm kiếm</button><button className="secondary" type="button" onClick={() => { setSearch(''); setActiveSearch(''); loadFoods(''); }}>Tất cả</button></form>
          {loading ? <p className="hint">Đang tải dữ liệu từ MongoDB Atlas...</p> : foods.length === 0 ? <p className="hint">Chưa có món ăn phù hợp. Hãy thêm món mới hoặc đổi từ khóa.</p> : <div className="cards">
            {foods.map(food => <article className="food" key={food._id}>
              <div className="food-emoji">{food.imageUrl ? <img src={food.imageUrl} alt={food.name} onError={e => { e.currentTarget.style.display='none'; }} /> : '🥘'}</div>
              <div className="food-info"><div className="food-top"><strong>{food.name}</strong><span>{money(food.price)}</span></div><p>{food.category} · {food.cuisine}</p><small>Mã: {food.foodId} · Tồn kho: {food.quantity}</small><div className="food-actions"><button onClick={() => showDetail(food._id)}>Chi tiết</button><button onClick={() => editFood(food)}>Sửa</button><button className="danger" onClick={() => removeFood(food)}>Xóa</button></div></div>
            </article>)}
          </div>}
        </section>
      </main>
      <footer>Ứng dụng thực hành Điện toán đám mây · React · Express · MongoDB Atlas · Docker · Render</footer>
      {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><div className="modal" role="dialog" aria-modal="true" aria-label="Chi tiết món ăn" onClick={e => e.stopPropagation()}><button className="close" aria-label="Đóng" onClick={() => setDetail(null)}>✕</button><div className="eyebrow">THÔNG TIN MÓN ĂN</div><h2>{detail.name}</h2><p><b>Mã:</b> {detail.foodId}</p><p><b>Loại / Vùng miền:</b> {detail.category} / {detail.cuisine}</p><p><b>Nguyên liệu:</b> {detail.ingredients.join(', ')}</p><p><b>Giá:</b> {money(detail.price)}</p><p><b>Số lượng:</b> {detail.quantity}</p><p><b>Mô tả:</b> {detail.description}</p>{detail.imageUrl && <img className="detail-image" src={detail.imageUrl} alt={detail.name}/>}<button className="primary" onClick={() => setDetail(null)}>Đóng</button></div></div>}
    </div>
  );
}
