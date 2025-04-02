
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

interface BidLogProps {
  auctionId: string;
}

// Dummy data for bid history
const generateDummyBids = (auctionId: string): Bid[] => {
  return [
    {
      id: "b1",
      userId: "u1",
      userName: "JohnBidder",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      amount: 520,
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      message: "This item is amazing! Increasing my bid."
    },
    {
      id: "b2",
      userId: "u2",
      userName: "AuctionPro",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      amount: 500,
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
    {
      id: "b3",
      userId: "u3",
      userName: "CollectorX",
      userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      amount: 480,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "b4",
      userId: "u4",
      userName: "VintageLover",
      userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      amount: 450,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      message: "I've been looking for this everywhere!"
    }
  ];
};

const BidLog = ({ auctionId }: BidLogProps) => {
  const [bids, setBids] = useState<Bid[]>([]);

  // Simulate loading bid data
  useEffect(() => {
    // In a real app, you would fetch the bids from an API
    setBids(generateDummyBids(auctionId));

    // Simulate real-time updates by adding a new bid every few seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of a new bid
        const newBid: Bid = {
          id: `bid-${Date.now()}`,
          userId: `user-${Math.floor(Math.random() * 100)}`,
          userName: ["QuickBidder", "AuctionFan", "CollectorElite", "VintageHunter"][Math.floor(Math.random() * 4)],
          userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
          amount: bids.length > 0 ? bids[0].amount + Math.floor(Math.random() * 20) + 5 : 450,
          timestamp: new Date(),
          message: Math.random() > 0.7 ? "I need this in my collection!" : undefined
        };
        
        setBids(prevBids => [newBid, ...prevBids]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [auctionId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Bid History</h3>
      </div>
      
      <ScrollArea className="h-[350px] p-4">
        {bids.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No bids yet. Be the first to bid!
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <img 
                  src={bid.userAvatar} 
                  alt={bid.userName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{bid.userName}</p>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-auction-purple font-bold">
                    {formatCurrency(bid.amount)}
                  </p>
                  {bid.message && (
                    <p className="text-sm text-gray-600 mt-1">{bid.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BidLog;
