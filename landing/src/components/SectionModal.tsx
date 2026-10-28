import React, { useEffect } from 'react';
import { MODAL_UI_COPY } from '../content/modalContent';

export type SectionId = 'projects' | 'about' | 'achievements' | 'contact' | null;

interface SectionModalProps {
  activeSection: SectionId;
  onClose: () => void;
}

export const SectionModal: React.FC<SectionModalProps> = ({ activeSection, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeSection || !MODAL_UI_COPY.sections[activeSection]) return null;

  const section = MODAL_UI_COPY.sections[activeSection];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={section.title}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-neutral-950/95 border border-white/15 p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={MODAL_UI_COPY.closeAriaLabel}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="pr-8 mb-6">
          <h3 className="font-cormorant text-2xl sm:text-3xl font-medium text-white tracking-wide">
            {section.title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-light tracking-wide">
            {section.subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="mb-6">
          <div className="space-y-4 text-sm sm:text-base text-neutral-300">
            <p className="leading-relaxed">{section.description}</p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-300/90">
                {section.cardEyebrow}
              </div>
              {section.directEmail ? (
                <div className="space-y-3">
                  <a
                    href={`mailto:${section.directEmail}`}
                    className="block text-white hover:text-amber-200 text-base font-mono underline underline-offset-4 transition-colors"
                  >
                    {section.directEmail}
                  </a>
                  {section.contactHelperText && (
                    <p className="text-xs text-neutral-400">{section.contactHelperText}</p>
                  )}
                </div>
              ) : (
                <>
                  <h4 className="text-white font-medium">{section.cardTitle}</h4>
                  <p className="text-xs sm:text-sm text-neutral-400">{section.cardDescription}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-full bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {MODAL_UI_COPY.closeButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
