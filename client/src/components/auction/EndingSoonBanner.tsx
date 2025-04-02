
import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EndingSoonBannerProps {
  isEndingSoon: boolean;
  timeLeft: string;
}

const EndingSoonBanner = ({ isEndingSoon, timeLeft }: EndingSoonBannerProps) => {
  if (!isEndingSoon) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <div className="flex items-center text-white">
        <Clock className="h-5 w-5 mr-2 animate-pulse-slow" />
        <span className="font-medium">Ending soon! {timeLeft} left</span>
      </div>
    </div>
  );
};

export default EndingSoonBanner;
