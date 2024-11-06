import { NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="wrapper">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'header__link active' : 'header__link'
          }>
          Pokedex
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'header__link active' : 'header__link'
          }>
          Favorites
        </NavLink>
      </div>
    </header>
  );
};
