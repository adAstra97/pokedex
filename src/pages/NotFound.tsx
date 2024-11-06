import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Link to="/" className="not-found__link">
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};
