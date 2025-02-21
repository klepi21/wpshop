'use client';

import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { WalletButton } from '@/components/wallet/WalletButton';

const ADMIN_ADDRESSES = [
  'erd1u5p4njlv9rxvzvmhsxjypa69t2dran33x9ttpx0ghft7tt35wpfsxgynw4',
  'erd1f3rwh7fzfq0he8vwvd4f82pdj4eaxxjcxdarx2x4kxq28u06mmgq3r24vg',
  'erd12xqam5lxx6xeteaewx25xarqd3ypleetkv35w40nuqchsxqar9zqkslg66'
];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { address } = useGetAccount();

  if (!address) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-white/60 mb-8">Please connect your wallet to access the admin panel</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  if (!ADMIN_ADDRESSES.includes(address)) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 