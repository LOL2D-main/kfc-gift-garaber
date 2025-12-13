import { Sparkles, PartyPopper, Gift } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxNumber: number;
}

const PrizeModal = ({ isOpen, onClose, boxNumber }: PrizeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-primary to-kfc-red-dark border-4 border-accent max-w-md mx-auto">
        {isOpen && <Confetti />}
        
        <div className="flex flex-col items-center text-center py-6">
          <div className="relative mb-4">
            <PartyPopper className="w-16 h-16 text-accent animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-pulse" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            🎉 CHÚC MỪNG! 🎉
          </h2>
          
          <p className="text-primary-foreground/80 mb-4">
            Bạn đã mở hộp quà số {boxNumber}
          </p>
          
          <div className="bg-accent rounded-2xl p-6 mb-6 animate-glow-pulse">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-8 h-8 text-accent-foreground" />
              <span className="text-lg font-semibold text-accent-foreground">Phần thưởng:</span>
            </div>
            <p className="text-4xl md:text-5xl font-bold text-accent-foreground">
              300.000 VNĐ
            </p>
          </div>
          
          <p className="text-primary-foreground/70 text-sm mb-4">
            Voucher KFC trị giá 300K đang chờ bạn! 🍗
          </p>
          
          <Button 
            onClick={onClose}
            className="bg-accent hover:bg-kfc-gold-light text-accent-foreground font-bold px-8 py-3 text-lg"
          >
            Tuyệt vời! 🎊
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrizeModal;
