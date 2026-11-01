import { useState } from "react";
import { Share2, Check } from "lucide-react";

const ShareButton = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title,
      url: url,
    };

    // Try Web Share API (works on mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share canceled or failed:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-[#E5B236] text-white rounded-lg hover:bg-[#d4a32e] transition-all duration-300 cursor-pointer"
      title={copied ? "Copied!" : "Share"}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      <span className="text-sm font-medium">{copied ? "Copied!" : "Share"}</span>
    </button>
  );
};

export default ShareButton;
