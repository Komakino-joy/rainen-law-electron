interface Link {
  href: string;
  ctaText: string;
}

interface Links {
  properties?: Link[];
  clients?: Link[];
  reports?: Link[];
  management?: Link[];
}

const links: Links = {
  properties: [
    {
      href: '/properties/add-new',
      ctaText: 'Create property',
    },
    {
      href: '/properties/search',
      ctaText: 'Search for property',
    },
  ],
  clients: [
    {
      href: '/clients/add-new',
      ctaText: 'Create client',
    },
    {
      href: '/clients/search',
      ctaText: 'Search for client',
    },
  ],
  reports: [
    {
      href: '/reports/property-report',
      ctaText: 'Property Report',
    },
  ],
  management: [
    {
      href: '/management',
      ctaText: 'Site Management',
    },
  ],
};

export type LinkType = keyof typeof links;

export default links;
