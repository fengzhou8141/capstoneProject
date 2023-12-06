// AdminPanel.js
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Users from './User/Users';
import Holds from './Hold/Holds';
import Bookings from './Booking/Bookings';
import Chats from './Chat/Chats';
import Products from './Product/Products';
import { useAuthContext } from '../../hooks/useAuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuthContext();

  // Check if user is an admin, otherwise redirect
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-panel">
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/admin/users" id="users-link">
              <i className="fas fa-user"></i>
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/holds" id="holds-link">
              <i className="fas fa-box"></i>
              Holds
            </Link>
          </li>
          <li>
            <Link to="/admin/bookings" id="bookings-link">
              <i className="fas fa-calendar"></i>
              Bookings
            </Link>
          </li>
          <li>
            <Link to="/admin/products" id="products-link">
              <i className="fas fa-boxes"></i>
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/chats" id="chats-link">
              <i className="fas fa-comments"></i>
              Chats
            </Link>
          </li>
        </ul>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="users/*" element={<Users />} />
          <Route path="holds/*" element={<Holds />} />
          <Route path="bookings/*" element={<Bookings />} />
          <Route path="chats/*" element={<Chats />} />
          <Route path="products/*" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
