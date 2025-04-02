
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Dummy data for bids
const dummyBids = [
  {
    id: "bid1",
    auctionId: "a1",
    auctionTitle: "Vintage Camera Collection",
    bidAmount: 450,
    currentHighestBid: 500,
    status: "outbid",
    timeLeft: "2d 5h",
    image: "/placeholder.svg"
  },
  {
    id: "bid2",
    auctionId: "a2",
    auctionTitle: "Antique Wooden Desk",
    bidAmount: 750,
    currentHighestBid: 750,
    status: "winning",
    timeLeft: "1d 12h",
    image: "/placeholder.svg"
  },
  {
    id: "bid3",
    auctionId: "a3",
    auctionTitle: "Signed Sports Memorabilia",
    bidAmount: 320,
    currentHighestBid: 320,
    status: "winning",
    timeLeft: "3h 45m",
    image: "/placeholder.svg"
  },
  {
    id: "bid4",
    auctionId: "a4",
    auctionTitle: "Rare Comic Book Collection",
    bidAmount: 1200,
    currentHighestBid: 1500,
    status: "outbid",
    timeLeft: "6h 20m",
    image: "/placeholder.svg"
  },
  {
    id: "bid5",
    auctionId: "a5",
    auctionTitle: "Modern Art Painting",
    bidAmount: 900,
    currentHighestBid: 900,
    status: "winning",
    timeLeft: "4d 8h",
    image: "/placeholder.svg"
  },
  {
    id: "bid6",
    auctionId: "a6",
    auctionTitle: "Vintage Motorcycle",
    bidAmount: 1800,
    currentHighestBid: 2100,
    status: "lost",
    timeLeft: "Ended",
    endedDate: "Jun 15, 2023",
    image: "/placeholder.svg"
  },
  {
    id: "bid7",
    auctionId: "a7",
    auctionTitle: "Limited Edition Watch",
    bidAmount: 650,
    currentHighestBid: 850,
    status: "lost",
    timeLeft: "Ended",
    endedDate: "Jul 3, 2023",
    image: "/placeholder.svg"
  }
];

const MyBids = () => {
  const [bids, setBids] = useState<typeof dummyBids>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setBids(dummyBids);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter bids based on active tab
  const filteredBids = activeTab === 'all' 
    ? bids 
    : bids.filter(bid => bid.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>My Bids</h1>
          <p className="mt-1 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Track your bidding activity across all auctions</p>
        </div>
        
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'all', label: 'All Bids' },
                { id: 'winning', label: 'Winning' },
                { id: 'outbid', label: 'Outbid' },
                { id: 'lost', label: 'Lost' }
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
        ) : filteredBids.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center animate-fade-in">
            <p className="text-gray-500">No bids found in this category.</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">Browse Auctions</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid, index) => (
              <div 
                key={bid.id} 
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={bid.image} 
                      alt={bid.auctionTitle} 
                      className="w-full h-full object-cover"
                    />
                    {bid.status === 'lost' && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-medium text-sm uppercase">Ended</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link to={`/auction/${bid.auctionId}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-auction-purple">{bid.auctionTitle}</h3>
                    </Link>
                    <div className="mt-1 flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Your bid: <span className="font-medium text-gray-900">${bid.bidAmount}</span></p>
                        <p className="text-sm text-gray-500">
                          {bid.status === 'lost' ? 'Final price:' : 'Current highest:'} 
                          <span className="font-medium text-gray-900"> ${bid.currentHighestBid}</span>
                        </p>
                        {bid.status === 'lost' && (
                          <p className="text-sm text-gray-500">Ended on: <span className="font-medium">{bid.endedDate}</span></p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bid.status === 'winning' 
                            ? 'bg-green-100 text-green-800' 
                            : bid.status === 'outbid' 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status === 'winning' 
                            ? 'Winning' 
                            : bid.status === 'outbid' 
                              ? 'Outbid'
                              : 'Lost'}
                        </span>
                        {bid.status !== 'lost' && (
                          <span className="text-sm text-gray-500 mt-1">{bid.timeLeft} left</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link to={`/auction/${bid.auctionId}`}>
                        <Button variant="default" size="sm">
                          View Auction
                        </Button>
                      </Link>
                      {bid.status === 'outbid' && (
                        <Link to={`/auction/${bid.auctionId}`}>
                          <Button variant="outline" size="sm">
                            Place New Bid
                          </Button>
                        </Link>
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

export default MyBids;
