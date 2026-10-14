import React from 'react';

// Delicate floral vine corner ornament in lilac & soft silver
export const CornerFlourish: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = 'w-12 h-12 md:w-16 md:h-16 text-[#C9B4D9]' }) => {
  const rotationClass = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1 -scale-x-100',
    'bottom-left': 'bottom-1 left-1 -scale-y-100',
    'bottom-right': 'bottom-1 right-1 -scale-x-100 -scale-y-100',
  }[position];

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none opacity-80 ${rotationClass} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M6 6 C28 6, 45 15, 60 30 C75 45, 84 62, 84 84 C84 68, 68 52, 52 40 C36 28, 20 20, 6 20 Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M6 6 Q30 8, 48 24 T74 74"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 14 Q24 16, 38 28 T58 64"
        stroke="#B9B5C4"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Delicate floral buds */}
      <circle cx="28" cy="18" r="3.5" fill="#C9B4D9" />
      <circle cx="48" cy="24" r="3" fill="#E7DDEB" stroke="#B9B5C4" strokeWidth="1" />
      <circle cx="64" cy="45" r="3.5" fill="#C9B4D9" />
      <circle cx="74" cy="74" r="2.5" fill="#B9B5C4" />
      {/* Little leaf swirls */}
      <path
        d="M26 14 C28 10, 34 11, 35 15 C33 18, 28 17, 26 14 Z"
        fill="#C9B4D9"
        fillOpacity="0.7"
      />
      <path
        d="M46 20 C49 16, 55 17, 56 21 C54 24, 49 23, 46 20 Z"
        fill="#C9B4D9"
        fillOpacity="0.7"
      />
    </svg>
  );
};

// Elegant crown tiara for debutante
export const DebutanteCrown: React.FC<{ className?: string }> = ({
  className = 'w-7 h-7 text-[#B9B5C4]',
}) => (
  <svg
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 28L8 12L18 20L24 6L30 20L40 12L44 28H4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="#E7DDEB"
      fillOpacity="0.4"
    />
    <line x1="4" y1="31" x2="44" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="6" r="2.5" fill="#C9B4D9" stroke="#B9B5C4" strokeWidth="1" />
    <circle cx="8" cy="12" r="2" fill="#C9B4D9" stroke="#B9B5C4" strokeWidth="1" />
    <circle cx="40" cy="12" r="2" fill="#C9B4D9" stroke="#B9B5C4" strokeWidth="1" />
    <circle cx="24" cy="19" r="1.5" fill="#B9B5C4" />
    <circle cx="14" cy="24" r="1.5" fill="#B9B5C4" />
    <circle cx="34" cy="24" r="1.5" fill="#B9B5C4" />
  </svg>
);

// Romantic heart with delicate wings
export const SoftHeart: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4 text-[#C9B4D9]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Silver ornamental divider
export const SilverDivider: React.FC<{ className?: string }> = ({
  className = 'my-8',
}) => (
  <div className={`flex items-center justify-center gap-3 w-full max-w-md mx-auto ${className}`} aria-hidden="true">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B9B5C4]/70 to-[#C9B4D9]" />
    <div className="flex items-center gap-1.5 text-[#C9B4D9]">
      <span className="w-1.5 h-1.5 rotate-45 bg-[#B9B5C4]" />
      <SoftHeart className="w-3.5 h-3.5 text-[#C9B4D9]" />
      <span className="w-1.5 h-1.5 rotate-45 bg-[#B9B5C4]" />
    </div>
    <div className="h-px flex-1 bg-gradient-to-r from-[#C9B4D9] via-[#B9B5C4]/70 to-transparent" />
  </div>
);
