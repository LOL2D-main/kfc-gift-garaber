import * as React from "react";
import { useSearchParams } from "react-router-dom";
import GiftBox from "@/components/GiftBox";
import PrizeModal from "@/components/PrizeModal";
import ShareModal from "@/components/ShareModal";
import { useDeviceId } from "@/hooks/useDeviceId";
import { supabase } from "@/integrations/supabase/client";
import kfcBackground from "@/assets/kfc-background.jpg";
import kfcEgift from "@/assets/kfc-egift.png";
import kfcCombo from "@/assets/kfc-combo.png";
import kfcBucket from "@/assets/kfc-bucket.png";
import { Sparkles, Gift, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REQUIRED_SHARES = 10;

const Index = () => {
  const deviceId = useDeviceId();
  const [searchParams] = useSearchParams();
  const [selectedBox, setSelectedBox] = React.useState<number | null>(null);
  const [showPrizeModal, setShowPrizeModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [hasParticipated, setHasParticipated] = React.useState(false);
  const [shareCount, setShareCount] = React.useState(0);
  const [isClaimed, setIsClaimed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Check if returning from login with claimed status
  React.useEffect(() => {
    if (searchParams.get('claimed') === 'true') {
      setIsClaimed(true);
      toast({
        title: "🎉 Chúc mừng!",
        description: "Voucher 300K của bạn đã được kích hoạt!",
      });
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (deviceId) {
      checkParticipation();
    }
  }, [deviceId]);

  const checkParticipation = async () => {
    const { data, error } = await supabase
      .from('gift_receivers')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (data) {
      setHasParticipated(true);
      setSelectedBox(data.selected_box);
      setShareCount(data.share_count);
      setIsClaimed(data.is_claimed);
    }
    setLoading(false);
  };

  const handleOpenBox = async (id: number) => {
    if (hasParticipated) {
      toast({
        title: "Đã tham gia",
        description: "Bạn đã chọn hộp quà rồi! Hãy chia sẻ để nhận quà.",
        variant: "destructive",
      });
      setShowShareModal(true);
      return;
    }

    // Save to database
    const { error } = await supabase
      .from('gift_receivers')
      .insert({
        device_id: deviceId,
        selected_box: id,
        share_count: 0,
        is_claimed: false,
      });

    if (error) {
      console.error('Error saving participation:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    setSelectedBox(id);
    setHasParticipated(true);
    setShowPrizeModal(true);
  };

  const handleClosePrizeModal = () => {
    setShowPrizeModal(false);
    setShowShareModal(true);
  };

  const handleShareComplete = () => {
    setShareCount(REQUIRED_SHARES);
    setShowShareModal(false);
  };

  const handleShareCountUpdate = (newCount: number) => {
    setShareCount(newCount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary-foreground text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${kfcBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Large decorative KFC images - positioned at corners */}
      <div className="absolute top-0 left-0 w-1/3 md:w-1/4 max-w-xs z-10">
        <img 
          src={kfcEgift} 
          alt="KFC eGift" 
          className="w-full opacity-95 animate-float shadow-2xl rounded-br-3xl"
          style={{ animationDelay: '0s' }}
        />
      </div>
      
      <div className="absolute top-0 right-0 w-1/3 md:w-1/4 max-w-xs z-10">
        <img 
          src={kfcCombo} 
          alt="KFC Combo" 
          className="w-full opacity-95 animate-float shadow-2xl rounded-bl-3xl"
          style={{ animationDelay: '1s' }}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-1/3 md:w-1/4 max-w-sm z-10">
        <img 
          src={kfcBucket} 
          alt="KFC Bucket" 
          className="w-full opacity-80"
          style={{ animationDelay: '2s' }}
        />
      </div>
      
      <div className="absolute bottom-0 right-0 w-1/3 md:w-1/4 max-w-sm z-10 transform scale-x-[-1]">
        <img 
          src={kfcBucket} 
          alt="KFC Bucket" 
          className="w-full opacity-80"
          style={{ animationDelay: '2.5s' }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent animate-pulse" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              KFC TẶNG QUÀ
            </h1>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-white/80 animate-float">
            🍗 Chọn một hộp quà may mắn! 🍗
          </p>
          
          {/* Status badge */}
          {hasParticipated && (
            <div className="mt-4 inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-6 py-2 border border-accent/50">
              {isClaimed ? (
                <>
                  <Gift className="w-5 h-5 text-accent" />
                  <p className="text-accent font-semibold">
                    ✅ Đã nhận voucher 300K!
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <p className="text-accent font-semibold">
                    Chia sẻ: {shareCount}/{REQUIRED_SHARES} lần
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 lg:gap-6 max-w-xl mx-auto">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((id, index) => (
            <GiftBox
              key={id}
              id={id}
              onOpen={handleOpenBox}
              isOpened={selectedBox === id}
              isLocked={hasParticipated && selectedBox !== id}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Action button */}
        {hasParticipated && !isClaimed && (
          <button
            onClick={() => setShowShareModal(true)}
            className="mt-8 bg-accent hover:bg-kfc-gold-light text-accent-foreground font-bold px-8 py-4 rounded-full text-lg shadow-xl transition-all hover:scale-105 animate-glow-pulse"
          >
            🎁 Chia sẻ để nhận quà ({shareCount}/{REQUIRED_SHARES})
          </button>
        )}

        {/* Footer */}
        <div className="mt-6 md:mt-10 text-center">
          <p className="text-white/60 text-sm md:text-base">
            🎁 Mỗi người chỉ được chọn 1 hộp quà!
          </p>
          <p className="text-accent font-bold text-lg md:text-xl mt-2 animate-pulse">
            Chia sẻ 10 lần để nhận voucher 300K 🍗
          </p>
        </div>
      </div>

      {/* Modals */}
      <PrizeModal 
        isOpen={showPrizeModal}
        onClose={handleClosePrizeModal}
        boxNumber={selectedBox || 0}
      />
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        deviceId={deviceId}
        shareCount={shareCount}
        onShareComplete={handleShareComplete}
        onShareCountUpdate={handleShareCountUpdate}
      />
    </div>
  );
};

export default Index;
