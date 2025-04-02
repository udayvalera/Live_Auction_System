
export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[]; // Multiple images for slideshow
  currentBid: number;
  startingBid: number;
  bidCount: number;
  views: number;
  likes: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  endTime: Date;
  startTime?: Date; // Added for upcoming auctions
  status: 'active' | 'ending-soon' | 'ended' | 'upcoming';
  documents?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export const auctions: Auction[] = [
  {
    id: '1',
    title: 'Vintage Mechanical Watch',
    description: 'A rare vintage mechanical watch from the 1960s in excellent condition. Check out more details at https://watchhistory.com/vintage-1960s.',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5'
    ],
    currentBid: 450,
    startingBid: 200,
    bidCount: 12,
    views: 243,
    likes: 57,
    seller: {
      id: 's1',
      name: 'WatchCollector',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    status: 'active',
    documents: [
      {
        name: 'Certificate of Authenticity',
        url: 'https://images.unsplash.com/photo-1581736224940-a1aa8df181e0',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '2',
    title: 'Original Artwork: "Abstract Sunset"',
    description: 'Original acrylic painting on canvas, signed by the artist. View more of the artist\'s work at https://artist-gallery.com/sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
      'https://images.unsplash.com/photo-1549490349-8643362247b5'
    ],
    currentBid: 1250,
    startingBid: 800,
    bidCount: 8,
    views: 189,
    likes: 42,
    seller: {
      id: 's2',
      name: 'ArtGallery',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    status: 'ending-soon',
    documents: [
      {
        name: 'Provenance Documentation',
        url: 'https://images.unsplash.com/photo-1618091372796-20ee7ec01261',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '3',
    title: 'Gaming PC - High Performance Build',
    description: 'Custom-built gaming PC with RTX 3080, 32GB RAM, and 1TB SSD. For benchmarks visit https://gpu-tests.tech/rtx3080.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
      'https://images.unsplash.com/photo-1591489378430-ef2f4669cffb',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5'
    ],
    currentBid: 1800,
    startingBid: 1500,
    bidCount: 5,
    views: 312,
    likes: 29,
    seller: {
      id: 's3',
      name: 'TechDeals',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    status: 'active'
  },
  {
    id: '4',
    title: 'Antique Wooden Furniture Set',
    description: 'Beautiful handcrafted wooden furniture set from the early 1900s. For care instructions, visit https://antiques-care.org/wood.',
    imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
      'https://images.unsplash.com/photo-1538688423619-a81d3f23454b',
      'https://images.unsplash.com/photo-1611486212355-d276af4581e0'
    ],
    currentBid: 3200,
    startingBid: 2000,
    bidCount: 15,
    views: 278,
    likes: 64,
    seller: {
      id: 's4',
      name: 'VintageFinds',
      avatar: 'https://randomuser.me/api/portraits/women/54.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    status: 'ending-soon',
    documents: [
      {
        name: 'Appraisal Document',
        url: 'https://images.unsplash.com/photo-1586952518485-11b180e92764',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '5',
    title: 'Limited Edition Sneakers',
    description: 'Rare limited edition sneakers, never worn, with original box. Find similar models at https://sneakers.io/limited.',
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6',
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3'
    ],
    currentBid: 750,
    startingBid: 500,
    bidCount: 9,
    views: 421,
    likes: 87,
    seller: {
      id: 's5',
      name: 'SneakerHead',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    status: 'active',
    documents: [
      {
        name: 'Authenticity Card',
        url: 'https://images.unsplash.com/photo-1618091372796-20ee7ec01261',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '6',
    title: 'Luxury Designer Handbag',
    description: 'Authentic designer handbag from latest collection, includes certification. View the entire collection at https://luxury-bags.com/designer2023.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
      'https://images.unsplash.com/photo-1575822141483-413d4f22d6c0'
    ],
    currentBid: 2250,
    startingBid: 1800,
    bidCount: 7,
    views: 198,
    likes: 53,
    seller: {
      id: 's6',
      name: 'LuxuryReseller',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    endTime: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    status: 'ending-soon',
    documents: [
      {
        name: 'Designer Certificate',
        url: 'https://images.unsplash.com/photo-1599008633840-052c7f756385',
        type: 'image/jpeg'
      }
    ]
  },
  // Adding upcoming auctions
  {
    id: '7',
    title: 'Rare Book Collection',
    description: 'A collection of first edition classic novels in pristine condition. More details at https://rare-books-archive.com/classics.',
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18',
    images: [
      'https://images.unsplash.com/photo-1550399105-c4db5fb85c18',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353'
    ],
    currentBid: 0,
    startingBid: 1200,
    bidCount: 0,
    views: 175,
    likes: 32,
    seller: {
      id: 's7',
      name: 'BookCollector',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // Starts in 2 days
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9), // Ends in 9 days
    status: 'upcoming',
    documents: [
      {
        name: 'Authenticity Certificate',
        url: 'https://images.unsplash.com/photo-1586952518485-11b180e92764',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '8',
    title: 'Vintage Camera Collection',
    description: 'Collection of working vintage film cameras from the 1950s-1970s. See sample photos at https://vintage-lens.com/gallery.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9',
      'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848'
    ],
    currentBid: 0,
    startingBid: 950,
    bidCount: 0,
    views: 134,
    likes: 41,
    seller: {
      id: 's8',
      name: 'VintageGear',
      avatar: 'https://randomuser.me/api/portraits/women/61.jpg'
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // Starts tomorrow
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8), // Ends in 8 days
    status: 'upcoming'
  },
  {
    id: '9',
    title: 'Handcrafted Pottery Set',
    description: 'Exclusive handmade pottery set by renowned artisan. See the creation process at https://artisan-pottery.org/process.',
    imageUrl: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9',
    images: [
      'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa',
      'https://images.unsplash.com/photo-1576020799627-aeac74d58064'
    ],
    currentBid: 0,
    startingBid: 580,
    bidCount: 0,
    views: 98,
    likes: 23,
    seller: {
      id: 's9',
      name: 'ArtisanCrafts',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg'
    },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // Starts in 3 days
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // Ends in 10 days
    status: 'upcoming'
  }
];
