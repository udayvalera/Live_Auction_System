
export interface ReportedAuction {
  id: string;
  auctionId: string;
  auctionTitle: string;
  reportedBy: {
    id: string;
    name: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'banned';
  registeredDate: Date;
  lastLogin: Date;
  totalBids: number;
  totalAuctions: number;
  avatar: string;
}

export interface SiteMetrics {
  totalUsers: number;
  activeUsers: number;
  totalAuctions: number;
  activeAuctions: number;
  upcomingAuctions: number;
  completedAuctions: number;
  totalBids: number;
  totalSales: number;
  averageBidsPerAuction: number;
  dailyActiveUsers: {
    date: string;
    count: number;
  }[];
  newUserRegistrations: {
    date: string;
    count: number;
  }[];
  totalRevenue: {
    date: string;
    amount: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
}

// Dummy data for reports
export const reportedAuctions: ReportedAuction[] = [
  {
    id: 'report1',
    auctionId: '1',
    auctionTitle: 'Vintage Mechanical Watch',
    reportedBy: {
      id: 'user3',
      name: 'ReportUser',
    },
    reason: 'Suspicious item',
    description: 'The seller might be selling a counterfeit watch. The images don\'t match the description.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 'report2',
    auctionId: '3',
    auctionTitle: 'Gaming PC - High Performance Build',
    reportedBy: {
      id: 'user4',
      name: 'ConcernedUser',
    },
    reason: 'Inaccurate description',
    description: 'The PC specs in the description don\'t match what\'s shown in the images.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
  {
    id: 'report3',
    auctionId: '5',
    auctionTitle: 'Limited Edition Sneakers',
    reportedBy: {
      id: 'user5',
      name: 'SneakerExpert',
    },
    reason: 'Counterfeit item',
    description: 'These are fake sneakers. The stitching pattern is wrong and the logo is off-center.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: 'report4',
    auctionId: '6',
    auctionTitle: 'Luxury Designer Handbag',
    reportedBy: {
      id: 'user6',
      name: 'FashionLover',
    },
    reason: 'Misleading images',
    description: 'The bag in the images appears to be used, not new as claimed in the description.',
    status: 'dismissed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
];

// Dummy data for users
export const users: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    status: 'active',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100), // 100 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    totalBids: 0,
    totalAuctions: 0,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 's1',
    name: 'WatchCollector',
    email: 'watch@example.com',
    status: 'active',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    totalBids: 45,
    totalAuctions: 12,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: 's2',
    name: 'ArtGallery',
    email: 'art@example.com',
    status: 'active',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    totalBids: 28,
    totalAuctions: 8,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 's3',
    name: 'TechDeals',
    email: 'tech@example.com',
    status: 'active',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    totalBids: 67,
    totalAuctions: 15,
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: 's4',
    name: 'VintageFinds',
    email: 'vintage@example.com',
    status: 'banned',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    totalBids: 34,
    totalAuctions: 20,
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
  },
  {
    id: 's5',
    name: 'SneakerHead',
    email: 'sneakers@example.com',
    status: 'active',
    registeredDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    totalBids: 92,
    totalAuctions: 7,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
];

// Dummy site metrics
export const siteMetrics: SiteMetrics = {
  totalUsers: 1245,
  activeUsers: 876,
  totalAuctions: 567,
  activeAuctions: 128,
  upcomingAuctions: 43,
  completedAuctions: 396,
  totalBids: 12876,
  totalSales: 789500,
  averageBidsPerAuction: 22.7,
  dailyActiveUsers: [
    { date: '2023-10-01', count: 453 },
    { date: '2023-10-02', count: 421 },
    { date: '2023-10-03', count: 489 },
    { date: '2023-10-04', count: 521 },
    { date: '2023-10-05', count: 476 },
    { date: '2023-10-06', count: 514 },
    { date: '2023-10-07', count: 587 },
  ],
  newUserRegistrations: [
    { date: '2023-10-01', count: 23 },
    { date: '2023-10-02', count: 19 },
    { date: '2023-10-03', count: 27 },
    { date: '2023-10-04', count: 31 },
    { date: '2023-10-05', count: 24 },
    { date: '2023-10-06', count: 29 },
    { date: '2023-10-07', count: 36 },
  ],
  totalRevenue: [
    { date: '2023-10-01', amount: 12500 },
    { date: '2023-10-02', amount: 9800 },
    { date: '2023-10-03', amount: 14500 },
    { date: '2023-10-04', amount: 16700 },
    { date: '2023-10-05', amount: 13200 },
    { date: '2023-10-06', amount: 15800 },
    { date: '2023-10-07', amount: 18900 },
  ],
  categoryDistribution: [
    { category: 'Electronics', count: 132 },
    { category: 'Collectibles', count: 98 },
    { category: 'Fashion', count: 87 },
    { category: 'Art', count: 76 },
    { category: 'Jewelry', count: 65 },
    { category: 'Home & Garden', count: 54 },
    { category: 'Sports', count: 45 },
    { category: 'Vehicles', count: 10 },
  ],
};
