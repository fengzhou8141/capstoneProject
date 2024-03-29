import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');

  useEffect(() => {
    // Extract the first part of the pathname (excluding the /admin/ part)
    setActiveMenu(
      new URLSearchParams(location.search).get('category') || 'all'
    );
  }, [location.search]);

  const handleCategoryClick = (category) => {
    // Parse the current search params
    const searchParams = new URLSearchParams(location.search);

    // Set or update the 'category' parameter
    searchParams.set('category', category);

    // Combine the updated search params with the existing path
    const newUrl = `${location.pathname}?${searchParams.toString()}`;

    // Navigate to the new URL
    navigate(newUrl);
  };

  return (
    <div className="bg-light p-4" style={{ textAlign: 'center' }}>
      <h3 className="mb-4">Categories</h3>
      <ul className="list-unstyled" style={{ widh: '100%' }}>
        <li className="mb-2">
          <button
            onClick={() => handleCategoryClick('laptop')}
            className={
              activeMenu === 'laptop'
                ? 'active'
                : 'btn btn-light btn-block text-dark text-decoration-none hover-text-primary'
            }
          >
            Laptops
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => handleCategoryClick('mobile')}
            className={
              activeMenu === 'mobile'
                ? 'active'
                : 'btn btn-light btn-block text-dark text-decoration-none hover-text-primary'
            }
          >
            Mobiles
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => handleCategoryClick('furniture')}
            className={
              activeMenu === 'furniture'
                ? 'active'
                : 'btn btn-light btn-block text-dark text-decoration-none hover-text-primary'
            }
          >
            Furniture
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
