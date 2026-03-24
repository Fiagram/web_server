export const sidebarLinks = [
  {
    icon: "Home",
    route: "/",
    label: "Home",
  },
  {
    icon: "PieChart",
    route: "/portfolio",
    label: "Portfolio",
  },
  {
    icon: "TrendingUp",
    route: "/strategy",
    label: "Strategy",
  },
  {
    icon: "User",
    route: "/profile",
    label: "Profile",
  },
] as const;

/** Default asset groups for the financial indicators panel */
export const defaultIndicatorGroups: IndicatorGroup[] = [
  {
    id: 'crypto',
    name: 'Crypto Market',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', currentValue: 67542.30, changeWeek: 2.45, changeMonth: 8.12, changeYear: 142.56 },
      { symbol: 'ETH', name: 'Ethereum', currentValue: 3521.80, changeWeek: -1.23, changeMonth: 5.67, changeYear: 89.34 },
    ],
  },
  {
    id: 'vn-stock',
    name: 'Vietnamese Stock Market',
    assets: [
      { symbol: 'VNINDEX', name: 'VN-Index', currentValue: 1245.67, changeWeek: 0.89, changeMonth: -2.34, changeYear: 12.45 },
      { symbol: 'HNX', name: 'HNX Index', currentValue: 234.12, changeWeek: -0.45, changeMonth: -1.78, changeYear: 8.92 },
      { symbol: 'VN30', name: 'VN30 Index', currentValue: 1312.45, changeWeek: 1.12, changeMonth: -1.56, changeYear: 15.67 },
    ],
  },
  {
    id: 'us-stock',
    name: 'US Stock Market',
    assets: [
      { symbol: 'SPX', name: 'S&P 500', currentValue: 5234.18, changeWeek: 0.67, changeMonth: 3.45, changeYear: 24.56 },
      { symbol: 'DJI', name: 'Dow Jones', currentValue: 39512.84, changeWeek: 0.34, changeMonth: 2.89, changeYear: 18.23 },
      { symbol: 'IXIC', name: 'NASDAQ', currentValue: 16742.39, changeWeek: 1.23, changeMonth: 4.56, changeYear: 35.67 },
    ],
  },
  {
    id: 'asia-stock',
    name: 'Asian Stock Market',
    assets: [
      { symbol: 'N225', name: 'Nikkei 225', currentValue: 38456.78, changeWeek: -0.78, changeMonth: 1.23, changeYear: 28.45 },
      { symbol: 'HSI', name: 'Hang Seng', currentValue: 16723.45, changeWeek: -2.34, changeMonth: -5.67, changeYear: -12.34 },
    ],
  },
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    assets: [
      { symbol: 'XAU', name: 'Gold', currentValue: 2345.60, changeWeek: 0.56, changeMonth: 2.34, changeYear: 15.78 },
      { symbol: 'XAG', name: 'Silver', currentValue: 28.45, changeWeek: -0.89, changeMonth: 1.23, changeYear: 22.34 },
    ],
  },
];
