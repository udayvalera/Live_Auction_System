
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PlaceBidFormProps {
  auctionId: string;
  currentBid: number;
}

const PlaceBidForm = ({ auctionId, currentBid }: PlaceBidFormProps) => {
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  return (
    <form onSubmit={handlePlaceBid} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Your Bid (minimum ${currentBid + 1})
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            type="number"
            name="bidAmount"
            id="bidAmount"
            className="pl-7 pr-12"
            placeholder="0"
            min={currentBid + 1}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-6 text-lg bg-auction-purple hover:bg-auction-purple-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Placing Bid..." : "Place Bid Now"}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-2">
        By placing a bid, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default PlaceBidForm;
