import React, { useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ShortcutKey, KeySize } from '../types/shortcuts';

interface MobileKeyboardBarProps {
  shortcuts: ShortcutKey[];
  keySize: KeySize;
  onInsertText: (text: string, cursorOffset?: number) => void;
  onOpenConfig: () => void;
}

export const MobileKeyboardBar: React.FC<MobileKeyboardBarProps> = ({
  shortcuts,
  keySize,
  onInsertText,
  onOpenConfig,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Play subtle haptic feedback on touch devices
  const playHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch (e) {}
    }
  };

  const handleKeyClick = (key: ShortcutKey) => {
    playHaptic();
    onInsertText(key.insertText, key.cursorOffset || 0);
  };

  // Synchronized button dimensions matching the Header Terminal (>_ ) button
  // Medium (default) = 32x30px on mobile (w-8 h-[30px]), 36x30px on sm+ (sm:w-9 h-[30px])
  const sizeConfig = {
    small: {
      height: 'h-[26px]',
      fixedWidth: 'w-7 sm:w-8',
      minWidth: 'min-w-7 sm:min-w-8 px-1.5',
      text: 'text-[10px]',
      icon: 'w-3.5 h-3.5',
    },
    medium: {
      height: 'h-[30px]',
      fixedWidth: 'w-8 sm:w-9',
      minWidth: 'min-w-8 sm:min-w-9 px-2',
      text: 'text-[11px]',
      icon: 'w-4 h-4',
    },
    large: {
      height: 'h-9',
      fixedWidth: 'w-9 sm:w-10',
      minWidth: 'min-w-9 sm:min-w-10 px-2.5',
      text: 'text-xs',
      icon: 'w-4.5 h-4.5',
    },
  }[keySize];

  const visibleKeys = shortcuts.filter((k) => k.visible);

  return (
    <div className="w-full bg-[#11131a] border-t border-slate-800/90 px-2 sm:px-3 py-1.5 flex items-center gap-1.5 select-none z-20 shrink-0">
      {/* Horizontal Scrollable Python Coding Keys */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {visibleKeys.map((k) => {
          const isCompactLabel = k.label.length <= 3;
          return (
            <button
              key={k.id}
              onClick={() => handleKeyClick(k)}
              title={k.description || k.label}
              className={`shrink-0 rounded-lg font-mono font-semibold flex items-center justify-center transition-all active:scale-95 border whitespace-nowrap ${sizeConfig.height} ${sizeConfig.text} ${
                isCompactLabel ? sizeConfig.fixedWidth : sizeConfig.minWidth
              } ${
                k.isHighlight || k.id === 'tab'
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/50 hover:bg-amber-400/25 active:bg-amber-400 active:text-slate-950'
                  : 'bg-[#181c27] text-slate-200 border-slate-800 hover:bg-[#202636] hover:border-slate-700 active:bg-amber-400 active:text-slate-950'
              }`}
            >
              {k.label}
            </button>
          );
        })}
      </div>

      {/* Settings / Config Button synchronized to the exact same size as toolbar keys */}
      <div className="pl-1 border-l border-slate-800/80 shrink-0 flex items-center">
        <button
          onClick={() => {
            playHaptic();
            onOpenConfig();
          }}
          title="Cài đặt & Tùy biến thanh phím tắt"
          aria-label="Cài đặt thanh phím tắt"
          className={`relative rounded-lg bg-[#181c27] border border-slate-800 hover:bg-[#202636] hover:border-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0 ${sizeConfig.height} ${sizeConfig.fixedWidth}`}
        >
          <SlidersHorizontal className={sizeConfig.icon} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#11131a]" />
        </button>
      </div>
    </div>
  );
};
