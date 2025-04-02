
import AuctionForm from "@/components/AuctionForm";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateAuction = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Auctions
            </Button>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-2xl font-bold mb-6">Create New Auction</h1>
          <AuctionForm />
        </div>
      </main>
    </div>
  );
};

export default CreateAuction;
