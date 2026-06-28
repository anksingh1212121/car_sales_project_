import { useEffect, useState } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({ customer_name: '', address: '', phone_no: '' });

  const load = () => getCustomers().then(r => setCustomers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = ()   => { setEditing(null); setForm({ customer_name: '', address: '', phone_no: '' }); setModal(true); };
  const openEdit = (c)  => { setEditing(c); setForm({ customer_name: c.customer_name, address: c.address, phone_no: c.phone_no }); setModal(true); };

  const handleSubmit = async () => {
    if (editing) await updateCustomer(editing.customer_id, form);
    else         await createCustomer(form);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) { await deleteCustomer(id); load(); }
  };

  const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers <span>Records</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customers.length === 0 && <tr><td colSpan="5"><div className="empty">No customers found.</div></td></tr>}
                {customers.map(c => (
                  <tr key={c.customer_id}>
                    <td style={{ color: 'var(--muted)' }}>{c.customer_id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(232,124,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                          {initials(c.customer_name)}
                        </div>
                        <strong>{c.customer_name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{c.phone_no}</td>
                    <td style={{ color: 'var(--muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.customer_id)}>Delete</button>
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
            <h3>{editing ? 'Edit Customer' : 'Add New Customer'}</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="e.g. Aarav Patel" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input placeholder="10-digit mobile number" value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows={3} placeholder="Full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Add Customer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
