export const navbar = [
  {
    label: 'Dashboard',
    routerLink: 'dashboard',
  },
  {
    label: 'Central Repository',
    routerLink: 'central-repository',
  },
  {
    label: 'Support Tables',
    items: [
      {
        label: 'CFIN codes by category',
        routerLink: 'support-tables/cfin-by-category',
      },
      {
        label: 'POS Customers codes',
        routerLink: 'support-tables/pos-customers-codes',
      },
      {
        label: '92XXXXXX CFIN Codes',
        routerLink: 'support-tables/92-cfin-codes',
      },
      {
        label: '98XXXXXX CFIN Codes',
        routerLink: 'support-tables/98-cfin-codes',
      },
      {
        label: 'System duplicates',
        routerLink: 'support-tables/system-duplicates',
      },
    ],
  },
];
