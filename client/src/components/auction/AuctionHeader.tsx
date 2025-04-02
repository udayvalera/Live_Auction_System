
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuctionHeader = () => {
  return (
    <nav className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <Link to="/" className="flex items-center text-auction-purple hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Auctions
      </Link>
    </nav>
  );
};

export default AuctionHeader;
