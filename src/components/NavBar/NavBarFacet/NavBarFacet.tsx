import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from '~/icons/Icons';
import './NavBarFacet.scss';

interface OwnProps {
  name: string;
  links?: {
    href: string;
    ctaText: string;
  }[];
}

const NavBarFacet: React.FC<OwnProps> = ({ name, links }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="nav-bar-facet">
      <span
        className="nav-bar-facet-header"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span
          className={location.pathname.split('/')[1] === name ? 'selected' : ''}
        >
          {name}
        </span>
        {links ? <ChevronDown /> : null}
      </span>
      {links ? (
        <div
          className={`${isExpanded ? 'expanded' : 'hidden'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="nav-bar-facet-dropdown">
            {links.map((link) => (
              <span
                className="dropdown-option"
                key={link.href}
                onClick={() => {
                  setIsExpanded(false);
                  navigate(link.href);
                }}
              >
                {link.ctaText}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavBarFacet;
