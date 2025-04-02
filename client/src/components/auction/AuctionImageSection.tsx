
import React from "react";
import ImageSlideshow from "@/components/ImageSlideshow";
import AuctionStatusBadge from "./AuctionStatusBadge";
import EndingSoonBanner from "./EndingSoonBanner";
import UpcomingAuctionBanner from "./UpcomingAuctionBanner";

interface AuctionImageSectionProps {
  title: string;
  images: string[];
  status: 'active' | 'ending-soon' | 'ended' | 'upcoming';
  timeLeft: string;
  isEndingSoon: boolean;
  isUpcoming: boolean;
  startTime?: Date;
}

const AuctionImageSection = ({
  title,
  images,
  status,
  timeLeft,
  isEndingSoon,
  isUpcoming,
  startTime
}: AuctionImageSectionProps) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <ImageSlideshow images={images} title={title} />
      
      {/* Status Badge */}
      <AuctionStatusBadge status={status} timeLeft={timeLeft} startTime={startTime} />
      
      {/* Time Left for Ending Soon Auctions */}
      <EndingSoonBanner isEndingSoon={isEndingSoon} timeLeft={timeLeft} />
      
      {/* Info for Upcoming Auctions */}
      <UpcomingAuctionBanner isUpcoming={isUpcoming} startTime={startTime} />
    </div>
  );
};

export default AuctionImageSection;
