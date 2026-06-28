import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar     from './components/Navbar';
import Dashboard  from './pages/Dashboard';
import Cars       from './pages/Cars';
import Dealers    from './pages/Dealers';
import Customers  from './pages/Customers';
import Sales      from './pages/Sales';
import Feedback   from './pages/Feedback';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/cars"      element={<Cars />} />
            <Route path="/dealers"   element={<Dealers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales"     element={<Sales />} />
            <Route path="/feedback"  element={<Feedback />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
