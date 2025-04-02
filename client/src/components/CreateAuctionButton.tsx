
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CreateAuctionButton = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an auction",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    navigate("/create-auction");
  };
  
  return (
    <Button 
      className="bg-auction-purple hover:bg-auction-purple-dark text-white"
      onClick={handleClick}
    >
      <Plus className="h-5 w-5 mr-2" />
      Create Auction
    </Button>
  );
};

export default CreateAuctionButton;
