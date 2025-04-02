
import { useState } from "react";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReportAuctionModalProps {
  auctionId: string;
  auctionTitle: string;
}

const REPORT_REASONS = [
  { id: "counterfeit", label: "Counterfeit or replica item" },
  { id: "inappropriate", label: "Inappropriate or offensive content" },
  { id: "prohibited", label: "Prohibited or illegal item" },
  { id: "misrepresented", label: "Item misrepresented or misdescribed" },
  { id: "scam", label: "Potential scam or fraud" },
  { id: "other", label: "Other concern" }
];

const ReportAuctionModal = ({ auctionId, auctionTitle }: ReportAuctionModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleReasonToggle = (reasonId: string) => {
    if (selectedReasons.includes(reasonId)) {
      setSelectedReasons(selectedReasons.filter(id => id !== reasonId));
    } else {
      setSelectedReasons([...selectedReasons, reasonId]);
    }
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one reason for reporting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, you would send the report to your API
    console.log("Submitting report", { 
      auctionId, 
      reasons: selectedReasons, 
      additionalDetails 
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      setSelectedReasons([]);
      setAdditionalDetails("");
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe.",
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-1 text-gray-600 hover:text-red-600 hover:border-red-200"
        >
          <Flag className="h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Auction</DialogTitle>
          <DialogDescription>
            Help us keep our marketplace safe by reporting any concerns about this auction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Auction: {auctionTitle}</h4>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Why are you reporting this auction?</p>
            
            {REPORT_REASONS.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={reason.id} 
                  checked={selectedReasons.includes(reason.id)}
                  onCheckedChange={() => handleReasonToggle(reason.id)}
                />
                <label
                  htmlFor={reason.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reason.label}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <label htmlFor="details" className="text-sm font-medium block mb-2">
              Additional details (optional)
            </label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information that might help our team investigate."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAuctionModal;
