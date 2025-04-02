
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

interface BidTimelineProps {
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

const BidTimeline = ({ auctionId }: BidTimelineProps) => {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Bid Timeline</h3>
      </div>
      
      {bids.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No bids yet. Be the first to bid!
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="p-4 relative">
            {/* Timeline line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {bids.map((bid, index) => (
                <div 
                  key={bid.id} 
                  className={cn(
                    "relative flex items-start pl-14",
                    index === 0 && "animate-fade-in-up"
                  )}
                >
                  {/* Timeline dot */}
                  <div 
                    className={cn(
                      "absolute left-[26px] w-3 h-3 rounded-full border-2 border-white z-10",
                      index === 0 ? "bg-green-500" : "bg-gray-300"
                    )} 
                  />
                  
                  {/* Avatar */}
                  <div className="absolute left-0">
                    <Avatar className={cn(
                      "border-2", 
                      index === 0 ? "border-green-500" : "border-white"
                    )}>
                      <AvatarImage src={bid.userAvatar} alt={bid.userName} />
                      <AvatarFallback>{getInitials(bid.userName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Content */}
                  <div className={cn(
                    "rounded-lg p-4 w-full",
                    index === 0 ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"
                  )}>
                    <div className="flex justify-between">
                      <div>
                        <p className={cn(
                          "font-semibold",
                          index === 0 ? "text-green-800" : "text-gray-900"
                        )}>
                          {bid.userName}
                        </p>
                        <p className={cn(
                          "text-sm mt-0.5",
                          index === 0 ? "text-green-700" : "text-gray-500"
                        )}>
                          {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <div>
                        <p className={cn(
                          "text-lg font-bold",
                          index === 0 ? "text-green-600" : "text-auction-purple"
                        )}>
                          {formatCurrency(bid.amount)}
                        </p>
                        {index === 0 && (
                          <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full text-center mt-1">
                            Highest Bid
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {bid.message && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        "{bid.message}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default BidTimeline;
