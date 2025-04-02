
import React from "react";

const AuctionFooter = () => {
  return (
    <footer className="bg-white mt-16 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">© 2023 AuctionVerse. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-auction-purple">Terms</a>
            <a href="#" className="text-gray-500 hover:text-auction-purple">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-auction-purple">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuctionFooter;
