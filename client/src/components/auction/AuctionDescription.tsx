
import React from "react";
import LinkifiedText from "@/components/LinkifiedText";
import DocumentViewer from "@/components/DocumentViewer";
import ReportAuctionModal from "@/components/ReportAuctionModal";

interface AuctionDescriptionProps {
  id: string;
  title: string;
  description: string;
  seller: {
    name: string;
    avatar: string;
  };
  documents?: {
    name: string;
    url: string;
    type: string;
  }[];
}

const AuctionDescription = ({ id, title, description, seller, documents }: AuctionDescriptionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <ReportAuctionModal auctionId={id} auctionTitle={title} />
      </div>
      
      {/* Seller Information */}
      <div className="flex items-center mb-4">
        <img 
          src={seller.avatar} 
          alt={seller.name}
          className="w-8 h-8 rounded-full mr-2 object-cover"
        />
        <span className="text-sm text-gray-600">
          Listed by <span className="font-medium text-auction-purple">{seller.name}</span>
        </span>
      </div>
      
      {/* Description */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <LinkifiedText 
          text={description} 
          className="text-gray-700 whitespace-pre-line" 
        />
      </div>
      
      {/* Documents Section */}
      {documents && <DocumentViewer documents={documents} />}
    </div>
  );
};

export default AuctionDescription;
