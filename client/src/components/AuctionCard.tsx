
import { Heart, Eye, Clock, Calendar } from "lucide-react";
import { Auction } from "@/data/auctions";
import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AuctionCardProps {
  auction: Auction;
  index?: number;
}

const AuctionCard = ({ auction, index = 0 }: AuctionCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(auction.likes);
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const timeLeft = formatDistanceToNow(auction.endTime, { addSuffix: false });
  
  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'ending-soon': 'bg-orange-100 text-orange-800',
    'ended': 'bg-gray-100 text-gray-800',
    'upcoming': 'bg-blue-100 text-blue-800'
  };

  const statusText = {
    'active': 'Active',
    'ending-soon': `Ends in ${timeLeft}`,
    'ended': 'Ended',
    'upcoming': auction.startTime ? `Starts ${format(auction.startTime, 'MMM d')}` : 'Upcoming'
  };

  const isEndingSoon = auction.status === 'ending-soon';
  const isUpcoming = auction.status === 'upcoming';

  // Apply staggered animation delay based on card index
  const animationDelay = `${Math.min(index * 0.05, 0.3)}s`;

  return (
    <Link to={`/auction/${auction.id}`} className="block">
      <div 
        className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg hover:border-gray-200 auction-card-shadow animate-fade-in-up"
        style={{ animationDelay }}
      >
        <div className="relative">
          <img 
            src={auction.imageUrl} 
            alt={auction.title} 
            className="h-48 w-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={cn("auction-badge", statusColors[auction.status])}>
              {statusText[auction.status]}
            </span>
          </div>
          {isEndingSoon && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center text-white">
                <Clock className={cn("h-4 w-4 mr-1", isEndingSoon && "animate-pulse-slow")} />
                <span className="text-sm font-medium">Ending soon!</span>
              </div>
            </div>
          )}
          {isUpcoming && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center text-white">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Coming soon!</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1">{auction.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{auction.description}</p>
          
          <div className="flex justify-between items-center mb-3">
            {isUpcoming ? (
              <div>
                <p className="text-xs text-gray-500">Starting bid</p>
                <p className="text-lg font-bold text-auction-purple">
                  {formatCurrency(auction.startingBid)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500">Current bid</p>
                <p className="text-lg font-bold text-auction-purple">
                  {formatCurrency(auction.currentBid)}
                </p>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-gray-500">{auction.bidCount} bids</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="mt-1 bg-auction-purple hover:bg-auction-purple-dark text-white py-1 px-3 rounded-full text-sm transition-colors"
              >
                {isUpcoming ? "Notify Me" : "Bid Now"}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">{auction.views}</span>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleLike}
                className="flex items-center text-gray-500 hover:text-auction-purple transition-colors"
              >
                <Heart className={cn("h-4 w-4 mr-1", liked && "fill-auction-purple text-auction-purple")} />
                <span className="text-xs">{likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
