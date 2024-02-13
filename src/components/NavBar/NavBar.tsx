import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '~/context/AuthContext';
import NavBarFacet from './NavBarFacet/NavBarFacet';
import links, { LinkType } from './links';
import './NavBar.scss';

const NavBar = () => {
  const { logout } = useAuth();
  const isAdmin = useIsAdmin();

  if (!isAdmin) delete links.management;

  const navigate = useNavigate();

  return (
    <div id="nav-bar-wrapper">
      <span
        onClick={() => navigate('/index.html')}
        className={`home ${
          location.pathname === '/index.html' ? 'selected' : ''
        }`}
      >
        Home
      </span>
      {Object.keys(links).map((key) => (
        <NavBarFacet key={key} name={key} links={links[key as LinkType]} />
      ))}
      <span className="sign-out-button" onClick={() => logout()}>
        Sign out
      </span>
    </div>
  );
};

export default NavBar;
