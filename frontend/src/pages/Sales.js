import { useEffect, useState } from 'react';
import { getSales, createSale, deleteSale, getCars, getDealers, getCustomers } from '../services/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Sales() {
  const [sales, setSales]         = useState([]);
  const [cars, setCars]           = useState([]);
  const [dealers, setDealers]     = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ sale_date: '', price: '', dealer_id: '', car_id: '', customer_id: '' });

  const load = () => Promise.all([getSales(), getCars(), getDealers(), getCustomers()])
    .then(([s, c, d, cu]) => { setSales(s.data); setCars(c.data); setDealers(d.data); setCustomers(cu.data); })
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await createSale(form);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sale record?')) { await deleteSale(id); load(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales <span>Transactions</span></h1>
        <button className="btn btn-primary" onClick={() => { setForm({ sale_date: '', price: '', dealer_id: '', car_id: '', customer_id: '' }); setModal(true); }}>+ New Sale</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Date</th><th>Customer</th><th>Car</th><th>Dealer</th><th>State</th><th>Price</th><th></th></tr>
              </thead>
              <tbody>
                {sales.length === 0 && <tr><td colSpan="8"><div className="empty">No sales found.</div></td></tr>}
                {sales.map(s => (
                  <tr key={s.sale_id}>
                    <td style={{ color: 'var(--muted)' }}>{s.sale_id}</td>
                    <td>{new Date(s.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><strong>{s.customer_name}</strong></td>
                    <td>{s.brand} {s.model_number}</td>
                    <td>{s.dealer_name}</td>
                    <td><span className="badge badge-info">{s.state_name}</span></td>
                    <td><span className="price">{fmt(s.price)}</span></td>
                    <td><button className="btn btn-danger" onClick={() => handleDelete(s.sale_id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Record New Sale</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Sale Date</label>
                <input type="date" value={form.sale_date} onChange={e => setForm({ ...form, sale_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="e.g. 950000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Customer</label>
              <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Car</label>
              <select value={form.car_id} onChange={e => setForm({ ...form, car_id: e.target.value })}>
                <option value="">Select car</option>
                {cars.map(c => <option key={c.car_id} value={c.car_id}>{c.brand} — {c.model_number}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Dealer</label>
              <select value={form.dealer_id} onChange={e => setForm({ ...form, dealer_id: e.target.value })}>
                <option value="">Select dealer</option>
                {dealers.map(d => <option key={d.dealer_id} value={d.dealer_id}>{d.dealer_name} ({d.state_name})</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Record Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
