import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/contexts/AuthContext"; // Import User type

interface StickyBidFooterProps {
  auctionId: string;
  currentBid: number;
  endTime: Date;
  isEndingSoon: boolean;
  status: 'active' | 'ending-soon' | 'ended' | 'upcoming';
  user: User | null; // Add user prop
}

const StickyBidFooter = ({ auctionId, currentBid, endTime, isEndingSoon, status, user }: StickyBidFooterProps) => {
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Calculate percentage of time remaining
  const totalDuration = 3 * 24 * 60 * 60 * 1000; // Assuming 3 days auction duration
  const remaining = endTime.getTime() - Date.now();
  const progress = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
  
  const timeLeft = formatDistanceToNow(endTime, { addSuffix: false });
  
  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Validate bid amount
      const numericBid = Number(bidAmount);
      
      if (isNaN(numericBid) || numericBid <= currentBid) {
        toast({
          title: "Invalid bid amount",
          description: `Your bid must be higher than the current bid of $${currentBid}.`,
          variant: "destructive"
        });
      } else {
        // In a real app, you would send the bid to your API
        console.log("Placing bid", { auctionId, amount: numericBid });
        
        toast({
          title: "Bid placed successfully!",
          description: `You placed a bid of $${numericBid}.`,
        });
        
        setBidAmount("");
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBidButtonText = () => {
    if (isSubmitting) return "Placing Bid...";
    if (status === 'ended') return "Auction Ended";
    if (status === 'upcoming') return "Auction Not Started";
    
    // If user has entered a valid bid amount
    const numericBid = Number(bidAmount);
    if (!isNaN(numericBid) && numericBid > currentBid) {
      return `Place Bid (${formatCurrency(numericBid)})`;
    }
    
    // Default text with suggested next bid
    return `Bid ${formatCurrency(currentBid + 10)} or More`;
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300",
      isEndingSoon && "bg-orange-50"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Current Bid & Time Left */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div>
              <p className="text-xs text-gray-500 uppercase">Current Bid</p>
              <p className="text-xl font-bold text-auction-purple">{formatCurrency(currentBid)}</p>
            </div>
            
            <div className="hidden sm:block h-10 w-px bg-gray-200"></div>
            
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-1">
                <Clock className={cn(
                  "h-4 w-4", 
                  isEndingSoon ? "text-orange-500 animate-pulse-slow" : "text-gray-500"
                )} />
                <p className={cn(
                  "text-xs uppercase font-medium",
                  isEndingSoon ? "text-orange-600" : "text-gray-500"
                )}>
                  Time Left:
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  isEndingSoon ? "text-orange-600" : "text-gray-700"
                )}>
                  {timeLeft}
                </p>
              </div>
              <Progress 
                value={progress} 
                className={cn(
                  "h-1.5 mt-1 w-full sm:w-36",
                  progress <= 25 ? "bg-orange-100" : "bg-gray-100",
                  progress <= 25 ? "[&>div]:bg-orange-500" : "[&>div]:bg-auction-purple"
                )} 
              />
            </div>
          </div>
          
          {/* Bid Form */}
          {(status === 'active' || status === 'ending-soon') && user ? ( // Check for user
            <form onSubmit={handlePlaceBid} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-36">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  className="pl-7 pr-3"
                  placeholder={`${currentBid + 10}`}
                  min={currentBid + 1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className={cn(
                  "whitespace-nowrap h-10 w-full sm:w-auto",
                  isEndingSoon ? "bg-orange-500 hover:bg-orange-600" : "bg-auction-purple hover:bg-auction-purple-dark",
                  isEndingSoon && !bidAmount && "animate-pulse-slow"
                )}
                disabled={isSubmitting || status === 'ended' || status === 'upcoming'}
              >
                {getBidButtonText()}
              </Button>
            </form>
          ) : (
            <div className="w-full sm:w-auto">
              <Button 
                disabled
                className="w-full sm:w-auto bg-gray-400"
              >
                {user ? (status === 'ended' ? "Auction Ended" : "Auction Not Started") : "Login to Bid"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyBidFooter;