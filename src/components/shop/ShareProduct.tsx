import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProductProps {
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

export function ShareProduct({ product }: ShareProductProps) {
  const shareUrl = `${window.location.origin}/shop/${product.id}`;
  const shareText = `Check out ${product.name} on WoodenPunks`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-white/60 text-sm">Share:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title="Copy link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={shareToFacebook}
          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={shareToTwitter}
          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 