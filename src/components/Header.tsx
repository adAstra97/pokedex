import { NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="wrapper">
        <div className="header__logo">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'header__link active' : 'header__link'
            }>
            Pokedex
          </NavLink>
          <img src="/pokeball.svg" alt="pokeball" width={30}></img>
        </div>
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
