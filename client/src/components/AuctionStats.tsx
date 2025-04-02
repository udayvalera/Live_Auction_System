
import { Eye, Heart, MessageCircle, BarChart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuctionStatsProps {
  views: number;
  likes: number;
  bids: number;
}

const AuctionStats = ({ views, likes, bids }: AuctionStatsProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  
  const toggleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 px-2 my-6">
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-gray-600">
          <Eye className="h-5 w-5 mr-2" />
          <span>{views} views</span>
        </div>
        
        <button 
          onClick={toggleLike}
          className="flex items-center text-gray-600 hover:text-auction-purple transition-colors"
        >
          <Heart className={cn("h-5 w-5 mr-2", liked && "fill-auction-purple text-auction-purple")} />
          <span>{likeCount} likes</span>
        </button>
        
        <div className="flex items-center text-gray-600">
          <BarChart className="h-5 w-5 mr-2" />
          <span>{bids} bids</span>
        </div>
      </div>
      
      <button className="flex items-center text-gray-600 hover:text-auction-purple transition-colors">
        <MessageCircle className="h-5 w-5 mr-2" />
        <span>Share</span>
      </button>
    </div>
  );
};

export default AuctionStats;
