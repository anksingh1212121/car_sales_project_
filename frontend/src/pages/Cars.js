import { useEffect, useState } from 'react';
import { getCars, createCar, updateCar, deleteCar } from '../services/api';

export default function Cars() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ brand: '', model_number: '' });

  const load = () => getCars().then(r => setCars(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = ()    => { setEditing(null); setForm({ brand: '', model_number: '' }); setModal(true); };
  const openEdit = (car) => { setEditing(car); setForm({ brand: car.brand, model_number: car.model_number }); setModal(true); };

  const handleSubmit = async () => {
    if (editing) await updateCar(editing.car_id, form);
    else         await createCar(form);
    setModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this car?')) { await deleteCar(id); load(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cars <span>Catalog</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Car</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Brand</th><th>Model</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 && <tr><td colSpan="4"><div className="empty">No cars found.</div></td></tr>}
                {cars.map(c => (
                  <tr key={c.car_id}>
                    <td style={{ color: 'var(--muted)' }}>{c.car_id}</td>
                    <td><strong>{c.brand}</strong></td>
                    <td>{c.model_number}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.car_id)}>Delete</button>
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
            <h3>{editing ? 'Edit Car' : 'Add New Car'}</h3>
            <div className="form-group">
              <label>Brand</label>
              <input placeholder="e.g. Hyundai" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Model Number</label>
              <input placeholder="e.g. Creta 2024" value={form.model_number} onChange={e => setForm({ ...form, model_number: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Add Car'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
