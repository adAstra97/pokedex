import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import Details from './pages/Details';

import './styles/app.scss';
import Favorites from './pages/Favorites';

export const App: React.FC = () => (
  <>
    <Header />
    <div className="content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Details />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  </>
);
