
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AuctionStatusBadgeProps {
  status: 'active' | 'ending-soon' | 'ended' | 'upcoming';
  timeLeft: string;
  startTime?: Date;
}

const AuctionStatusBadge = ({ status, timeLeft, startTime }: AuctionStatusBadgeProps) => {
  return (
    <div className="absolute top-4 right-4">
      <span className={cn(
        "px-3 py-1 rounded-full text-sm font-medium",
        status === 'active' ? "bg-green-100 text-green-800" : 
        status === 'ending-soon' ? "bg-orange-100 text-orange-800" : 
        status === 'upcoming' ? "bg-blue-100 text-blue-800" :
        "bg-gray-100 text-gray-800"
      )}>
        {status === 'active' ? 'Active' : 
         status === 'ending-soon' ? `Ends in ${timeLeft}` : 
         status === 'upcoming' && startTime ? `Starts ${format(startTime, 'MMM d')}` :
         status === 'upcoming' ? 'Upcoming' :
         'Ended'}
      </span>
    </div>
  );
};

export default AuctionStatusBadge;
