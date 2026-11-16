import React from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onRun: () => void;
  isRunning: boolean;
  viewMode: 'editor' | 'terminal';
  onChangeViewMode: (mode: 'editor' | 'terminal') => void;
  onOpenAIAssistant: (tab?: 'chat' | 'debug' | 'explain') => void;
  onOpenFolderMenu: () => void;
  onClearCurrentView: () => void;
  onOpenGoogleWorkspace?: () => void;
  googleUser?: User | null;
  hasGoogleToken?: boolean;
  onToggleDrawer: () => void;
  hasError: boolean;
  aiStatus?: 'online' | 'offline' | 'checking';
  aiStatusTooltip?: string;
  onCheckAiStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRun,
  isRunning,
  viewMode,
  onChangeViewMode,
  onOpenAIAssistant,
  onOpenFolderMenu,
  onClearCurrentView,
  onOpenGoogleWorkspace,
  googleUser,
  hasGoogleToken = false,
  onToggleDrawer,
  hasError,
  aiStatus = 'online',
  aiStatusTooltip = 'Máy chủ AI sẵn sàng',
  onCheckAiStatus,
}) => {
  const isGoogleConnected = !!(googleUser && hasGoogleToken);

  return (
    <header className="bg-[#11131a] border-b border-slate-800/90 pt-[env(safe-area-inset-top,0px)] select-none shrink-0 relative z-30">
      <div className="h-13 sm:h-14 px-2 sm:px-3 flex items-center justify-between gap-1.5">
        {/* Left Cluster: Menu + RUN + Mode Switch */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Drawer Menu Button (Uniform square tile) */}
          <button
            onClick={onToggleDrawer}
            className="w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl bg-[#181d2a] hover:bg-[#22293b] border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center transition active:scale-95 shrink-0"
            title="Menu Pydroid 3"
            aria-label="Mở menu tùy chọn"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
              <path d="M4 7h16" />
              <path d="M4 12h11" />
              <path d="M4 17h16" />
            </svg>
          </button>

          {/* Primary ▶ RUN CTA (Matching height 34px / 36px) */}
          <button
            onClick={onRun}
            disabled={isRunning}
            title="Chạy mã Python"
            className="h-[34px] sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 border-b-2 border-amber-600/90 text-slate-950 font-extrabold flex items-center gap-1 sm:gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-50 text-[11px] sm:text-xs shrink-0 tracking-wide"
          >
            {isRunning ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-slate-950">
                <path d="M7.5 5.25a1 1 0 0 1 1.52-.85l10.5 6.75a1 1 0 0 1 0 1.7l-10.5 6.75a1 1 0 0 1-1.52-.85V5.25z" />
              </svg>
            )}
            <span>{isRunning ? 'CHẠY' : 'RUN'}</span>
          </button>

          {/* Editor </> vs Terminal >_ Segmented Switch (Matching height 34px / 36px) */}
          <div className="h-[34px] sm:h-9 flex items-center bg-[#161a24] p-0.5 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => onChangeViewMode('editor')}
              title="Trình soạn thảo mã"
              aria-label="Trình soạn thảo"
              className={`h-full w-[30px] sm:w-8 rounded-lg flex items-center justify-center transition ${
                viewMode === 'editor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 8-4 4 4 4" />
                <path d="m16 8 4 4-4 4" />
                <path d="m13.5 5-3 14" />
              </svg>
            </button>
            <button
              onClick={() => onChangeViewMode('terminal')}
              title="Màn hình Terminal"
              aria-label="Terminal"
              className={`h-full w-[30px] sm:w-8 rounded-lg flex items-center justify-center transition ${
                viewMode === 'terminal'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 7 5 5-5 5" />
                <path d="M12 17h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Crisp Vertical Divider */}
        <div className="w-px h-5 bg-slate-800 shrink-0 hidden xs:block sm:block" />

        {/* Right Action Cluster: Uniform 1:1 Square Tiles (AI/Debug, Folder, Trash, Google G) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* AI Assistant / Error Debugger Tile (with server status badge) */}
          <button
            onClick={() => onOpenAIAssistant(hasError ? 'debug' : 'chat')}
            onContextMenu={(e) => {
              e.preventDefault();
              onCheckAiStatus?.();
            }}
            title={`Trợ lý AI & Gỡ lỗi Python (${aiStatusTooltip})`}
            aria-label="Trợ lý AI & Gỡ lỗi"
            className={`relative w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 shrink-0 shadow-sm ${
              hasError
                ? 'bg-rose-600 hover:bg-rose-500 border-rose-400/70 border-b-2 border-b-rose-800 text-amber-300'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-300/80 border-b-2 border-b-amber-600 text-slate-950'
            }`}
          >
            {hasError ? (
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 2 1.88 1.88M14.12 3.88 16 2" />
                <path d="M9 7.13v-1a3 3 0 1 1 6 0v1" />
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
                <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-slate-950">
                <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" />
                <circle cx="7.5" cy="17" r="1.6" />
                <path d="M17.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
              </svg>
            )}
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#11131a] ${
                aiStatus === 'online'
                  ? 'bg-emerald-400'
                  : aiStatus === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
          </button>

          {/* Folder Tile (Tệp & Mã Nguồn) */}
          <button
            onClick={onOpenFolderMenu}
            title="Tệp & Mã Nguồn"
            aria-label="Mở Tệp và Mã Nguồn"
            className="w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl bg-[#0d223d] hover:bg-[#132f54] border border-sky-500/80 text-sky-400 hover:text-sky-300 flex items-center justify-center transition active:scale-95 shrink-0 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.56.75L12 7.25A2 2 0 0 0 13.56 8H19a2 2 0 0 1 2 2v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V7z" />
            </svg>
          </button>

          {/* Trash Tile (Xóa mã nguồn / Terminal) */}
          <button
            onClick={onClearCurrentView}
            title={viewMode === 'editor' ? 'Xóa trắng mã trong tệp' : 'Xóa màn hình Terminal'}
            aria-label={viewMode === 'editor' ? 'Xóa mã nguồn' : 'Xóa Terminal'}
            className="w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl bg-[#2a121b] hover:bg-[#3b1926] border border-rose-500/75 text-rose-400 hover:text-rose-300 flex items-center justify-center transition active:scale-95 shrink-0 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16" />
              <path d="M9.5 4h5a1 1 0 0 1 1 1v2h-7V5a1 1 0 0 1 1-1z" />
              <path d="M6.5 7l1 12a2 2 0 0 0 2 1.8h5a2 2 0 0 0 2-1.8l1-12" />
              <path d="M10 11.5v5M14 11.5v5" />
            </svg>
          </button>

          {/* Google Account & Drive Tile (4-color Google G icon matching reference) */}
          {onOpenGoogleWorkspace && (
            <button
              onClick={onOpenGoogleWorkspace}
              title={
                isGoogleConnected
                  ? `Google: ${googleUser?.email || googleUser?.displayName}`
                  : 'Tài khoản Google & Đồng bộ Drive'
              }
              aria-label="Tài khoản Google và Drive"
              className={`relative w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 shrink-0 shadow-sm ${
                isGoogleConnected
                  ? 'bg-[#0e2439] border-emerald-400/80 hover:border-emerald-300'
                  : 'bg-[#0e1b2e] hover:bg-[#152842] border-sky-500/80'
              }`}
            >
              {googleUser?.photoURL && isGoogleConnected ? (
                <img
                  src={googleUser.photoURL}
                  alt="Google"
                  className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg viewBox="0 0 48 48" className="w-4.5 h-4.5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span
                className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#11131a] ${
                  isGoogleConnected ? 'bg-emerald-400' : 'bg-slate-400'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
