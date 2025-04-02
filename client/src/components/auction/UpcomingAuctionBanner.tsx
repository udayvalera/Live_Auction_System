
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface UpcomingAuctionBannerProps {
  isUpcoming: boolean;
  startTime?: Date;
}

const UpcomingAuctionBanner = ({ isUpcoming, startTime }: UpcomingAuctionBannerProps) => {
  if (!isUpcoming || !startTime) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <div className="flex items-center text-white">
        <Calendar className="h-5 w-5 mr-2" />
        <span className="font-medium">
          Starts {format(startTime, 'MMMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default UpcomingAuctionBanner;
