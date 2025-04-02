
import React from "react";
import PlaceBidForm from "@/components/PlaceBidForm";

interface MobileBidInfoProps {
  isUpcoming: boolean;
  startingBid: number;
  currentBid: number;
  auctionId: string;
}

const MobileBidInfo = ({ isUpcoming, startingBid, currentBid, auctionId }: MobileBidInfoProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="lg:hidden bg-white rounded-xl border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="mb-4">
        <h2 className="text-sm text-gray-500 uppercase">
          {isUpcoming ? "Starting Bid" : "Current Bid"}
        </h2>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-auction-purple mr-2">
            {isUpcoming ? formatCurrency(startingBid) : formatCurrency(currentBid)}
          </span>
          {!isUpcoming && (
            <span className="text-gray-500">
              started at {formatCurrency(startingBid)}
            </span>
          )}
        </div>
      </div>
      
      {/* Place Bid Form on mobile */}
      {!isUpcoming && (
        <PlaceBidForm auctionId={auctionId} currentBid={currentBid} />
      )}
    </div>
  );
};

export default MobileBidInfo;
