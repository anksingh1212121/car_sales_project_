import { useEffect, useState } from 'react';
import { getDealers, createDealer, updateDealer, deleteDealer, getStates } from '../services/api';

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [states, setStates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ dealer_name: '', contact_no: '', state_id: '' });

  const load = () => Promise.all([getDealers(), getStates()])
    .then(([d, s]) => { setDealers(d.data); setStates(s.data); })
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd  = ()       => { setEditing(null); setForm({ dealer_name: '', contact_no: '', state_id: '' }); setModal(true); };
  const openEdit = (dealer) => { setEditing(dealer); setForm({ dealer_name: dealer.dealer_name, contact_no: dealer.contact_no, state_id: dealer.state_id }); setModal(true); };

  const handleSubmit = async () => {
    if (editing) await updateDealer(editing.dealer_id, form);
    else         await createDealer(form);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this dealer?')) { await deleteDealer(id); load(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dealers <span>Network</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Dealer</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Dealer Name</th><th>State</th><th>Contact</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {dealers.length === 0 && <tr><td colSpan="5"><div className="empty">No dealers found.</div></td></tr>}
                {dealers.map(d => (
                  <tr key={d.dealer_id}>
                    <td style={{ color: 'var(--muted)' }}>{d.dealer_id}</td>
                    <td><strong>{d.dealer_name}</strong></td>
                    <td><span className="badge badge-info">{d.state_name}</span></td>
                    <td style={{ color: 'var(--muted)' }}>{d.contact_no}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(d.dealer_id)}>Delete</button>
                    </td>
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
            <h3>{editing ? 'Edit Dealer' : 'Add New Dealer'}</h3>
            <div className="form-group">
              <label>Dealer Name</label>
              <input placeholder="e.g. Mumbai Motors" value={form.dealer_name} onChange={e => setForm({ ...form, dealer_name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact No</label>
                <input placeholder="10-digit number" value={form.contact_no} onChange={e => setForm({ ...form, contact_no: e.target.value })} />
              </div>
              <div className="form-group">
                <label>State</label>
                <select value={form.state_id} onChange={e => setForm({ ...form, state_id: e.target.value })}>
                  <option value="">Select state</option>
                  {states.map(s => <option key={s.state_id} value={s.state_id}>{s.state_name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Add Dealer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
