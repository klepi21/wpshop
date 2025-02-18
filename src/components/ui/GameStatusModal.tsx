import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GameStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: 'signing' | 'processing' | 'checking' | 'revealing';
  gameResult: 'win' | 'lose' | null;
}

const DYNAMIC_MESSAGES = {
  signing: [
    "Preparing your fighter...",
    "Getting ready for battle...",
    "Warming up...",
  ],
  processing: [
    "Entering the arena...",
    "The tension builds...",
    "Your opponent awaits...",
  ],
  checking: [
    "Calculating odds...",
    "Reading the cosmic signs...",
    "The coin is in motion...",
  ],
  revealing: [
    "Destiny approaches...",
    "Fortune favors the bold...",
    "The moment of truth...",
  ],
};

const STEPS = [
  { id: 'signing', label: 'Signing Transaction' },
  { id: 'processing', label: 'Processing' },
  { id: 'checking', label: 'Checking Result' },
  { id: 'revealing', label: 'Revealing Winner' },
];

export function GameStatusModal({ isOpen, onClose, currentStep, gameResult }: GameStatusModalProps) {
  const [message, setMessage] = useState('');

  // Cycle through dynamic messages
  useEffect(() => {
    if (!isOpen) return;

    const messages = DYNAMIC_MESSAGES[currentStep];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setMessage(messages[currentIndex]);
      currentIndex = (currentIndex + 1) % messages.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, currentStep]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-[#1A1A1A] p-8 w-full">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="relative">
              {STEPS.map((step, index) => {
                const isActive = STEPS.findIndex(s => s.id === currentStep) >= index;
                const isComplete = STEPS.findIndex(s => s.id === currentStep) > index;

                return (
                  <div key={step.id} className="flex items-center py-1">
                    <div className="relative flex items-center justify-center">
                      <div 
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                          ${isActive ? 'border-[#C99733] bg-[#C99733]/20' : 'border-zinc-700 bg-zinc-800/50'}`}
                      >
                        {isComplete ? (
                          <svg className="w-6 h-6 text-[#C99733]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className={`text-sm ${isActive ? 'text-[#C99733]' : 'text-zinc-500'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`ml-3 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {step.label}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div 
                        className={`flex-grow border-t-2 mx-4 ${
                          isComplete ? 'border-[#C99733]' : 'border-zinc-700'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* VS Video Animation with Result Overlay */}
          <div className="relative h-48 mb-8 rounded-xl overflow-hidden">
            <video
              src="/img/vsvideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Result Overlay */}
            <AnimatePresence>
              {gameResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    className="text-center"
                  >
                    <h3 className={`text-4xl font-bold mb-2 ${
                      gameResult === 'win' ? 'text-[#FFD163]' : 'text-red-500'
                    }`}>
                      {gameResult === 'win' ? 'Victory!' : 'Defeat!'}
                    </h3>
                    <button
                      onClick={onClose}
                      className="px-6 py-1.5 bg-gradient-to-r from-[#C99733] to-[#FFD163] text-black rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Message */}
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6"
          >
            <p className="text-lg text-[#C99733] font-medium">
              {gameResult ? 'Game has ended!' : message}
            </p>
          </motion.div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 