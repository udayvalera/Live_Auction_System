import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { auctions, Auction } from "@/data/auctions";
import BidTimeline from "@/components/BidTimeline";
import AuctionStats from "@/components/AuctionStats";
import StickyBidFooter from "@/components/StickyBidFooter";
import AuctionHeader from "@/components/auction/AuctionHeader";
import AuctionImageSection from "@/components/auction/AuctionImageSection";
import AuctionDescription from "@/components/auction/AuctionDescription";
import MobileBidInfo from "@/components/auction/MobileBidInfo";
import AuctionFooter from "@/components/auction/AuctionFooter";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundAuction = auctions.find((a) => a.id === id);
      setAuction(foundAuction || null);
      setLoading(false);
    }, 800);
  }, [id]);

  // Update time left every second
  useEffect(() => {
    if (!auction || auction.status === "ended" || auction.status === "upcoming")
      return;

    const updateTimeLeft = () => {
      if (auction) {
        setTimeLeft(formatDistanceToNow(auction.endTime, { addSuffix: false }));
      }
    };

    // Initial update
    updateTimeLeft();

    // Set interval for updates
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Auction Not Found</h2>
            <p className="mt-2 text-gray-500">
              The auction you're looking for doesn't exist or has been removed.
            </p>
            <AuctionHeader />
          </div>
        </main>
      </div>
    );
  }

  const isEndingSoon = auction.status === "ending-soon";
  const isUpcoming = auction.status === "upcoming";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <AuctionHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Auction Info */}
          <div className="lg:col-span-2 space-y-6">
            <AuctionImageSection
              title={auction.title}
              images={auction.images}
              status={auction.status}
              timeLeft={timeLeft}
              isEndingSoon={isEndingSoon}
              isUpcoming={isUpcoming}
              startTime={auction.startTime}
            />

            <AuctionDescription
              id={auction.id}
              title={auction.title}
              description={auction.description}
              seller={auction.seller}
              documents={auction.documents}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Bid Timeline - Now given more prominence */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <BidTimeline auctionId={auction.id} />
            </div>

            {/* Current Bid Info (Only visible on mobile) */}
            <MobileBidInfo
              isUpcoming={isUpcoming}
              startingBid={auction.startingBid}
              currentBid={auction.currentBid}
              auctionId={auction.id}
            />
          </div>
        </div>
      </main>

      {/* Sticky Bid Footer - Visible on all screen sizes */}
      <StickyBidFooter
        auctionId={auction.id}
        currentBid={auction.currentBid}
        endTime={auction.endTime}
        isEndingSoon={isEndingSoon}
        status={auction.status}
        user={user} // Pass user to StickyBidFooter
      />

      {/* Footer */}
      <AuctionFooter />
    </div>
  );
};

export default AuctionDetail;