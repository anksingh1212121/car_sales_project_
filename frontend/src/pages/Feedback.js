import { useEffect, useState } from 'react';
import { getFeedback, createFeedback, deleteFeedback, getDealers, getCustomers } from '../services/api';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Feedback() {
  const [feedback, setFeedback]   = useState([]);
  const [dealers, setDealers]     = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ rating: 5, comments: '', feedback_date: '', dealer_id: '', customer_id: '' });

  const load = () => Promise.all([getFeedback(), getDealers(), getCustomers()])
    .then(([f, d, c]) => { setFeedback(f.data); setDealers(d.data); setCustomers(c.data); })
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    await createFeedback(form);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback?')) { await deleteFeedback(id); load(); }
  };

  const ratingColor = (r) => r >= 4 ? 'var(--success)' : r === 3 ? 'var(--accent)' : 'var(--danger)';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer <span>Feedback</span></h1>
        <button className="btn btn-primary" onClick={() => { setForm({ rating: 5, comments: '', feedback_date: '', dealer_id: '', customer_id: '' }); setModal(true); }}>+ Add Feedback</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Customer</th><th>Dealer</th><th>State</th><th>Rating</th><th>Comments</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {feedback.length === 0 && <tr><td colSpan="8"><div className="empty">No feedback found.</div></td></tr>}
                {feedback.map(f => (
                  <tr key={f.feedback_id}>
                    <td style={{ color: 'var(--muted)' }}>{f.feedback_id}</td>
                    <td><strong>{f.customer_name}</strong></td>
                    <td>{f.dealer_name}</td>
                    <td><span className="badge badge-info">{f.state_name}</span></td>
                    <td><span className="stars" style={{ color: ratingColor(f.rating) }}>{stars(f.rating)}</span></td>
                    <td style={{ color: 'var(--muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.comments || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{new Date(f.feedback_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><button className="btn btn-danger" onClick={() => handleDelete(f.feedback_id)}>Delete</button></td>
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
            <h3>Add Feedback</h3>
            <div className="form-group">
              <label>Customer</label>
              <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Dealer</label>
              <select value={form.dealer_id} onChange={e => setForm({ ...form, dealer_id: e.target.value })}>
                <option value="">Select dealer</option>
                {dealers.map(d => <option key={d.dealer_id} value={d.dealer_id}>{d.dealer_name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Rating (1–5)</label>
                <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.feedback_date} onChange={e => setForm({ ...form, feedback_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea rows={3} placeholder="Write feedback here..." value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
