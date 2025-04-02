
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

// Dummy data for user's auctions
const dummyAuctions = [
  {
    id: "ua1",
    title: "Vintage Record Collection",
    description: "Collection of rare vinyl records from the 1960s and 1970s.",
    currentBid: 380,
    bids: 7,
    endDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    status: "active",
    image: "/placeholder.svg"
  },
  {
    id: "ua2",
    title: "Handcrafted Wooden Furniture",
    description: "Artisan-crafted wooden table and chair set, made from reclaimed oak.",
    currentBid: 650,
    bids: 4,
    endDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    status: "active",
    image: "/placeholder.svg"
  },
  {
    id: "ua3",
    title: "Digital Camera Bundle",
    description: "Professional DSLR camera with multiple lenses and accessories.",
    currentBid: 1200,
    bids: 12,
    endDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    status: "ended",
    image: "/placeholder.svg"
  },
  {
    id: "ua4",
    title: "Antique Pocket Watch",
    description: "18th century gold-plated pocket watch in working condition.",
    currentBid: 0,
    bids: 0,
    endDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    status: "draft",
    image: "/placeholder.svg"
  }
];

const MyAuctions = () => {
  const [auctions, setAuctions] = useState<typeof dummyAuctions>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuctions(dummyAuctions);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter auctions based on active tab
  const filteredAuctions = auctions.filter(auction => {
    if (activeTab === 'all') return true;
    return auction.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>My Auctions</h1>
            <p className="mt-1 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Manage your listings and track their performance</p>
          </div>
          <Link to="/create-auction" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Auction
            </Button>
          </Link>
        </div>
        
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'all', label: 'All Auctions' },
                { id: 'active', label: 'Active' },
                { id: 'ended', label: 'Ended' },
                { id: 'draft', label: 'Drafts' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-auction-purple text-auction-purple'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4 animate-fade-in">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow animate-skeleton-pulse">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center animate-fade-in">
            <p className="text-gray-500">You don't have any auctions in this category.</p>
            <Link to="/create-auction">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create New Auction
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAuctions.map((auction, index) => (
              <div 
                key={auction.id} 
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={auction.image} 
                      alt={auction.title} 
                      className="w-full h-full object-cover"
                    />
                    {auction.status !== 'active' && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-medium text-sm uppercase">
                          {auction.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link to={`/auction/${auction.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-auction-purple">{auction.title}</h3>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{auction.description}</p>
                    <div className="mt-2 flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          {auction.status === 'active' ? 'Current bid:' : 'Final bid:'}
                          {' '}
                          <span className="font-medium text-gray-900">
                            {auction.currentBid > 0 ? `$${auction.currentBid}` : 'No bids yet'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">{auction.bids} {auction.bids === 1 ? 'bid' : 'bids'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {auction.status === 'ended' 
                            ? 'Ended on:' 
                            : auction.status === 'active'
                              ? 'Ends on:'
                              : 'Draft created:'}
                        </p>
                        <p className="text-sm font-medium">{formatDate(auction.endDate)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      {auction.status === 'draft' ? (
                        <>
                          <Button variant="default" size="sm">
                            Edit Draft
                          </Button>
                          <Button variant="outline" size="sm">
                            Publish
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to={`/auction-analytics/${auction.id}`}>
                            <Button variant="default" size="sm">
                              View Analytics
                            </Button>
                          </Link>
                          {auction.status === 'active' && (
                            <Button variant="outline" size="sm">
                              Edit Listing
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-white mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2023 AuctionVerse. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-auction-purple">Terms</a>
              <a href="#" className="text-gray-500 hover:text-auction-purple">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-auction-purple">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyAuctions;
