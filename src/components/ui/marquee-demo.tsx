'use client';

import { Marquee } from '@/components/ui/marquee';

const partnerLogos = [
  'https://ugc.production.linktr.ee/fb8d9c49-6fc2-4f2f-b830-31197ac0955d_LogoAsset-12ndset.png?io=true&size=avatar-v3_0',
  'https://app.eapes.com/_next/image?url=%2Flogo-light.png&w=256&q=75',
  'https://ugc.production.linktr.ee/eb89e34e-2e00-483d-b2fa-ab88e6772375_nxpNm8GA-400x400.jpeg?io=true&size=avatar-v3_0',
];

export function MarqueeDemo() {
  return (
    <div className="relative overflow-hidden bg-black py-12">
      <Marquee className="[--gap:4rem]" pauseOnHover speed={30} direction="right">
        <div className="flex items-center gap-16">
          {partnerLogos.map((image, i) => (
            <div key={i} className="flex items-center">
              <img
                src={image}
                alt={`Partner logo ${i + 1}`}
                className="h-24 w-auto object-contain"
              />
            </div>
          ))}
        </div>
    </Marquee>
    </div>
  );
} 