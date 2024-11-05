import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="wrapper">
        <Link to='/' className="header__logo">Pokedex</Link>
      </div>
    </header>
  );
};
