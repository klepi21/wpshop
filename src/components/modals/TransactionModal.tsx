import { Dialog } from '@headlessui/react';
import { Loader2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  status: 'processing' | 'success' | 'failed' | 'pending' | null;
  txHash?: string;
}

export function TransactionModal({ isOpen, status, txHash }: TransactionModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {}} // Cannot be closed
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-md bg-zinc-950 border border-[#A67C52]/20 rounded-xl p-8">
          <div className="flex flex-col items-center text-center">
            {(status === 'processing' || status === 'pending') && (
              <>
                <Loader2 className="w-16 h-16 text-[#A67C52] animate-spin mb-4" />
                <Dialog.Title className="text-2xl font-bold text-white mb-4">
                  Processing Transaction
                </Dialog.Title>
                <p className="text-white/60 mb-6">
                  Please wait while we process your transaction. Do not close this window.
                </p>
                {txHash && (
                  <p className="text-sm text-white/40">
                    Transaction Hash: {txHash.slice(0, 8)}...{txHash.slice(-8)}
                  </p>
                )}
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 