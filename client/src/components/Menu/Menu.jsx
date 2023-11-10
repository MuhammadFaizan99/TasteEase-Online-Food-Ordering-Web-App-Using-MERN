import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [menuItems, setMenuItems] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/menu/getMenu`);
      const menuData = response.data;

      setMenuItems({
        breakfast: menuData.filter(item => item.time === 'Breakfast'),
        lunch: menuData.filter(item => item.time === 'Lunch'),
        dinner: menuData.filter(item => item.time === 'Dinner'),
      });
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const navigate = useNavigate();

  const handleOrderNow = (menuItem) => {
    navigate(`/order`, { state: { itemName: menuItem.name, itemPrice: menuItem.price } });
  };

  return (
    <section className="menu-section">
      <div className="menu-nav">
        {window.innerWidth < 700 ? ( // Check window width
          showNav ? (
            <>
              <button
                className={activeCategory === 'breakfast' ? 'active' : ''}
                onClick={() => {
                  setActiveCategory('breakfast');
                  setShowNav(false);
                }}
              >
                Breakfast
              </button>
              <button
                className={activeCategory === 'lunch' ? 'active' : ''}
                onClick={() => {
                  setActiveCategory('lunch');
                  setShowNav(false);
                }}
              >
                Lunch
              </button>
              <button
                className={activeCategory === 'dinner' ? 'active' : ''}
                onClick={() => {
                  setActiveCategory('dinner');
                  setShowNav(false);
                }}
              >
                Dinner
              </button>
            </>
          ) : (
            <button className="hamburger" onClick={() => setShowNav(true)}>
              &#9776; Menu
            </button>
          )
        ) : (
          // Regular menu buttons for width >= 700px
          <>
            <button
              className={activeCategory === 'breakfast' ? 'active' : ''}
              onClick={() => setActiveCategory('breakfast')}
            >
              Breakfast
            </button>
            <button
              className={activeCategory === 'lunch' ? 'active' : ''}
              onClick={() => setActiveCategory('lunch')}
            >
              Lunch
            </button>
            <button
              className={activeCategory === 'dinner' ? 'active' : ''}
              onClick={() => setActiveCategory('dinner')}
            >
              Dinner
            </button>
          </>
        )}
      </div>
      <div className="menu-category" id={activeCategory}>
        <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h2>
        {menuItems[activeCategory].length === 0 ? (
          <p>No menu available for {activeCategory}.</p>
        ) : (
          <div className="menu-items">
            {menuItems[activeCategory].map((item, index) => (
              <div className="menu-item" key={index}>
                <div className="item-img">
                  <img src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${item.image}`} alt={item.name} />
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="price">{item.price}</span>
                  <button onClick={() => handleOrderNow(item)}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
