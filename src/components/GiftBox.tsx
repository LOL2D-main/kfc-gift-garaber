import * as React from "react";
import { Gift, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GiftBoxProps {
  id: number;
  onOpen: (id: number) => void;
  isOpened: boolean;
  isLocked: boolean;
  delay?: number;
}

const GiftBox = ({ id, onOpen, isOpened, isLocked, delay = 0 }: GiftBoxProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isShaking, setIsShaking] = React.useState(false);

  const handleClick = () => {
    if (!isOpened && !isLocked) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        onOpen(id);
      }, 500);
    }
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-300",
        "animate-bounce-in",
        isShaking && "animate-shake",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isOpened ? (
        <div
          className={cn(
            "w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36",
            "bg-gradient-to-br from-primary to-kfc-red-dark",
            "rounded-2xl shadow-2xl",
            "flex items-center justify-center",
            "border-4 border-accent",
            "transition-all duration-300",
            isHovered && !isLocked && "scale-110 animate-glow-pulse",
            "relative overflow-hidden"
          )}
        >
          {/* Ribbon effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-4 bg-accent" />
            <div className="absolute w-4 h-full bg-accent" />
          </div>
          
          {/* Bow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-accent rounded-full" />
              <div className="w-6 h-6 bg-accent rounded-full" />
            </div>
          </div>

          {isLocked ? (
            <Lock className="w-12 h-12 md:w-14 md:h-14 text-primary-foreground/50 z-10" />
          ) : (
            <Gift 
              className={cn(
                "w-12 h-12 md:w-14 md:h-14 text-primary-foreground z-10",
                "drop-shadow-lg transition-transform duration-300",
                isHovered && "scale-110"
              )} 
            />
          )}
          
          {/* Sparkles on hover */}
          {isHovered && !isLocked && (
            <>
              <Sparkles className="absolute top-2 left-2 w-4 h-4 text-accent animate-pulse" />
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-accent animate-pulse" />
              <Sparkles className="absolute bottom-2 left-2 w-4 h-4 text-accent animate-pulse" />
              <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-accent animate-pulse" />
            </>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36",
            "bg-gradient-to-br from-accent to-kfc-gold-light",
            "rounded-2xl shadow-2xl",
            "flex flex-col items-center justify-center",
            "border-4 border-secondary",
            "animate-bounce-in"
          )}
        >
          <Sparkles className="w-8 h-8 text-accent-foreground mb-1 animate-pulse" />
          <span className="text-xl md:text-2xl font-bold text-accent-foreground">300K</span>
          <span className="text-xs md:text-sm font-semibold text-accent-foreground">VNĐ</span>
        </div>
      )}
      
      {/* Gift number badge */}
      <div className={cn(
        "absolute -bottom-2 -right-2 w-8 h-8 rounded-full",
        "bg-secondary text-secondary-foreground",
        "flex items-center justify-center",
        "font-bold text-sm shadow-lg border-2 border-accent"
      )}>
        {id}
      </div>
    </div>
  );
};

export default GiftBox;
