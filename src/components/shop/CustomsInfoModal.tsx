'use client';

import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface CustomsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VAT_RATES = [
  { country: 'Germany', rate: '19%' },
  { country: 'France', rate: '20%' },
  { country: 'Italy', rate: '22%' },
  { country: 'Austria', rate: '20%' },
  { country: 'Spain', rate: '21%' },
  { country: 'Netherlands', rate: '21%' },
  { country: 'Portugal', rate: '23%' },
  { country: 'Belgium', rate: '21%' },
  { country: 'Poland', rate: '23%' },
  { country: 'Ireland', rate: '21%' },
  { country: 'Bulgaria', rate: '20%' },
  { country: 'Croatia', rate: '25%' },
  { country: 'Cyprus', rate: '19%' },
  { country: 'Czech Republic', rate: '21%' },
  { country: 'Denmark', rate: '25%' },
  { country: 'Estonia', rate: '20%' },
  { country: 'Finland', rate: '24%' },
  { country: 'Greece', rate: '24%' },
  { country: 'Hungary', rate: '27%' },
  { country: 'Latvia', rate: '21%' },
  { country: 'Lithuania', rate: '21%' },
  { country: 'Luxembourg', rate: '17%' },
  { country: 'Malta', rate: '18%' },
  { country: 'Romania', rate: '19%' },
  { country: 'Slovakia', rate: '20%' },
  { country: 'Slovenia', rate: '22%' },
  { country: 'Sweden', rate: '25%' }
];

export function CustomsInfoModal({ isOpen, onClose }: CustomsInfoModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-zinc-950 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold text-white">
              Customs & VAT Information
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Customs Disclaimer */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Customs Taxes and Duties</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                You may be subject to import duties and taxes. All items entering a foreign country are subject to customs inspection and the assessment of duties and taxes in accordance with the national laws of that country. Customs duties and taxes are assessed, generally, if the merchandise is dutiable and the value of the item is above the threshold set by the country's laws. You should contact your local customs office for further information, because Custom policies vary widely from country to country. Note that when ordering from us, you are considered the importer of the goods and you must comply with all laws and regulations of the country in which you are receiving the goods.
              </p>
            </div>

            {/* VAT Rates Table */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">European Union VAT Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VAT_RATES.map(({ country, rate }) => (
                  <div
                    key={country}
                    className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg border border-white/5"
                  >
                    <span className="text-white">{country}</span>
                    <span className="text-[#A67C52] font-medium">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 