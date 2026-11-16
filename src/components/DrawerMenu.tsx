import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Smartphone,
  Cpu,
  Globe,
  BookOpen,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Settings,
  Key,
  Cloud,
  Palette,
  UserCheck,
  Trash2,
  Plus,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { EngineType } from '../types';
import {
  getApiBaseUrl,
  getCustomServerUrl,
  getSavedServerHistory,
  saveCustomServerUrl,
  removeServerFromHistory,
  clearCustomServerUrl,
  testBackendServerUrl,
  isMobileOrApk,
  SavedServerEntry,
} from '../utils/apiConfig';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  engine: EngineType;
  onChangeEngine: (engine: EngineType) => void;
  onOpenPip: () => void;
  onOpenApk: () => void;
  onOpenSamples: () => void;
  onOpenSyntaxColor: () => void;
  onOpenApiKeySettings?: () => void;
  onOpenGoogleWorkspace?: () => void;
  onSwitchGoogleAccount?: () => void;
  googleUser?: User | null;
  hasGoogleToken?: boolean;
  onServerUrlChanged?: () => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  engine,
  onChangeEngine,
  onOpenPip,
  onOpenApk,
  onOpenSamples,
  onOpenSyntaxColor,
  onOpenApiKeySettings,
  onOpenGoogleWorkspace,
  onSwitchGoogleAccount,
  googleUser,
  hasGoogleToken = false,
  onServerUrlChanged,
  fontSize,
  onChangeFontSize,
}) => {
  const [testingServer, setTestingServer] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    tested: boolean;
    online: boolean;
    message?: string;
  } | null>(null);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [activeCustomUrl, setActiveCustomUrl] = useState<string>(() => getCustomServerUrl());
  const [serverInputUrl, setServerInputUrl] = useState<string>(() => getCustomServerUrl());
  const [serverInputLabel, setServerInputLabel] = useState<string>('');
  const [serverHistory, setServerHistory] = useState<SavedServerEntry[]>(() => getSavedServerHistory());

  useEffect(() => {
    if (!isOpen) return;
    const current = getCustomServerUrl();
    setActiveCustomUrl(current);
    setServerInputUrl(current);
    setServerHistory(getSavedServerHistory());
  }, [isOpen]);

  const handleTestConnection = async (targetUrl?: string) => {
    setTestingServer(true);
    setServerStatus({
      tested: false,
      online: false,
      message: 'Đang kết nối tới máy chủ...',
    });
    const urlToTest = (targetUrl ?? activeCustomUrl) || getApiBaseUrl() || window.location.origin;

    try {
      const check = await testBackendServerUrl(urlToTest, 60000, (msg) => {
        setServerStatus({
          tested: false,
          online: false,
          message: msg,
        });
      });
      if (check.ok) {
        setServerStatus({
          tested: true,
          online: true,
          message: check.geminiAvailable
            ? `${check.message} Gemini AI đã sẵn sàng.`
            : `${check.message} Hãy nhập Khóa Gemini API nếu máy chủ chưa cấu hình sẵn.`,
        });
      } else {
        setServerStatus({
          tested: true,
          online: false,
          message: check.message,
        });
      }
    } finally {
      setTestingServer(false);
    }
  };

  const handleSaveCustomServer = async () => {
    const saved = saveCustomServerUrl(serverInputUrl, serverInputLabel);
    if (saved.ok === false) {
      setServerStatus({
        tested: true,
        online: false,
        message: saved.error,
      });
      return;
    }

    setActiveCustomUrl(saved.url);
    setServerInputUrl(saved.url);
    setServerInputLabel('');
    setServerHistory(getSavedServerHistory());
    onServerUrlChanged?.();
    await handleTestConnection(saved.url);
  };

  const handleSelectSavedServer = async (entry: SavedServerEntry) => {
    const saved = saveCustomServerUrl(entry.url, entry.label);
    if (saved.ok) {
      setActiveCustomUrl(saved.url);
      setServerInputUrl(saved.url);
      setServerHistory(getSavedServerHistory());
      onServerUrlChanged?.();
      await handleTestConnection(saved.url);
    }
  };

  const handleRemoveSavedServer = (url: string) => {
    const updated = removeServerFromHistory(url);
    setServerHistory(updated);
    const remainingActive = getCustomServerUrl();
    setActiveCustomUrl(remainingActive);
    if (!remainingActive) {
      setServerInputUrl('');
      onServerUrlChanged?.();
    }
  };

  const handleUseDefaultOffline = () => {
    clearCustomServerUrl();
    setActiveCustomUrl('');
    setServerInputUrl('');
    setServerStatus({
      tested: false,
      online: false,
      message: 'Đã chuyển về chế độ mặc định (Pyodide Offline trên APK / Server nội bộ trên Web).',
    });
    onServerUrlChanged?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-start animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-80 max-w-[86vw] h-full bg-[#151821] border-r border-slate-800 shadow-2xl flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Drawer Header with Pydroid 3 App Icon */}
          <div className="p-4 bg-gradient-to-r from-[#1a1f2c] to-[#161a25] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/app-icon.jpg"
                alt="Pydroid 3"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700/80 shadow-md shrink-0"
              />
              <div>
                <h2 className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
                  <span>Pydroid 3</span>
                  <span className="text-amber-400">Web</span>
                </h2>
                <p className="text-[10px] text-slate-400">
                  IDE Python &amp; AI Android
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Menu Sections */}
          <div className="p-3 space-y-4 flex-1">
            {/* Google Account & Drive Sync Card */}
            {onOpenGoogleWorkspace && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-600/40 space-y-2">
                <button
                  onClick={() => {
                    onOpenGoogleWorkspace();
                    onClose();
                  }}
                  className="w-full text-left flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {googleUser?.photoURL ? (
                      <img
                        src={googleUser.photoURL}
                        alt="Google"
                        className="w-8 h-8 rounded-full border border-sky-400/50 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-600/30 border border-sky-500/40 flex items-center justify-center shrink-0">
                        <Cloud className="w-4 h-4 text-sky-300" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-100 truncate">
                        {googleUser
                          ? googleUser.displayName || googleUser.email || 'Tài khoản Google'
                          : 'Đăng nhập Google'}
                      </div>
                      <div className="text-[10px] text-sky-300 truncate">
                        {googleUser && hasGoogleToken
                          ? googleUser.email || 'Đã kết nối Drive & Đồng bộ'
                          : 'Google Drive, Ghi chú & Đồng bộ APK'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                </button>
              </div>
            )}

            {/* Section: Featured Tools (Cleaned per user request: no Trợ Lý AI, no Settings API Key) */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Tính Năng Nổi Bật
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    onOpenPip();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-xs text-slate-200 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span>Quản lý thư viện Pip</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    onOpenApk();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-indigo-950/30 border border-indigo-700/40 hover:border-indigo-500/60 text-xs text-indigo-200 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold">Đóng gói Android APK</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                <button
                  onClick={() => {
                    onOpenSamples();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-xs text-slate-200 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Kho mã mẫu có sẵn</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Section: Dual Engine */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Động Cơ Chạy Mã (Dual Engine)</span>
                {engine === 'pyodide' && (
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Offline 100%
                  </span>
                )}
              </div>
              <div className="space-y-1.5 bg-[#1a1e2a] p-2 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => onChangeEngine('pyodide')}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-2.5 transition ${
                    engine === 'pyodide'
                      ? 'bg-sky-600/25 text-sky-200 font-semibold border border-sky-500/50'
                      : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <Globe className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">2. Pyodide WASM (Client)</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Khuyên dùng APK</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                      Chạy Python 3.11 trực tiếp trên điện thoại, không cần mạng hay máy chủ.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onChangeEngine('cpython')}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-2.5 transition ${
                    engine === 'cpython'
                      ? 'bg-emerald-600/25 text-emerald-200 font-semibold border border-emerald-500/50'
                      : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">1. CPython Native (Server)</span>
                      <span className="text-[10px] text-amber-400 font-normal">Cần Máy Chủ</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                      Linux Python 3.10 trên máy chủ backend (Web Studio hoặc Server riêng).
                    </div>
                  </div>
                </button>

                {engine === 'cpython' && !activeCustomUrl && isMobileOrApk() && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-600/50 text-[11px] text-amber-200 space-y-1.5">
                    <div className="flex items-center space-x-1 font-semibold text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Lưu ý trên APK di động:</span>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-snug">
                      Chưa đặt URL Server riêng. Chuyển sang <strong>Pyodide WASM</strong> để chạy Offline tức thì.
                    </p>
                    <button
                      onClick={() => onChangeEngine('pyodide')}
                      className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center justify-center space-x-1 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Chuyển sang Pyodide WASM</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Rebuilt Custom Server & Optional Google Account Switcher */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Máy Chủ Tùy Chỉnh &amp; Google</span>
                <button
                  onClick={() => setShowServerConfig((v) => !v)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
                >
                  <Settings className="w-3 h-3" />
                  <span>{showServerConfig ? 'Thu gọn' : 'Đổi máy chủ'}</span>
                </button>
              </div>

              <div className="p-2.5 bg-[#1a1e2a] rounded-xl border border-slate-800 text-xs space-y-2.5">
                <div className="flex items-start space-x-2">
                  <Server className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-200 font-semibold text-[11px]">
                      {activeCustomUrl
                        ? 'Máy chủ đang chọn (Tùy chỉnh)'
                        : isMobileOrApk()
                        ? 'Chưa chọn máy chủ riêng (APK)'
                        : 'Máy chủ Web (Nội bộ)'}
                    </div>
                    <div className="text-[10px] text-slate-400 break-all font-mono">
                      {activeCustomUrl || getApiBaseUrl() || 'Kết nối trực tiếp cùng tên miền'}
                    </div>
                  </div>
                </div>

                {serverStatus && (
                  <div
                    className={`p-2 rounded-lg text-[11px] flex items-start space-x-1.5 border ${
                      serverStatus.online
                        ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                        : 'bg-sky-950/40 border-sky-600/40 text-sky-200'
                    }`}
                  >
                    {serverStatus.online ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{serverStatus.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => handleTestConnection()}
                    disabled={testingServer}
                    className="w-full py-2 px-2.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-600/50 text-sky-200 font-medium text-[11px] flex items-center justify-center space-x-1.5 active:scale-95 transition disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingServer ? 'animate-spin' : ''}`} />
                    <span>{testingServer ? 'Đang kiểm tra (tối đa 25s)...' : 'Kiểm tra kết nối máy chủ'}</span>
                  </button>

                  {onSwitchGoogleAccount && (
                    <button
                      onClick={() => {
                        onSwitchGoogleAccount();
                        onClose();
                      }}
                      className="w-full py-2 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-200 font-medium text-[11px] flex items-center justify-center space-x-1.5 active:scale-95 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {googleUser
                          ? 'Đăng nhập tài khoản Google khác'
                          : 'Đăng nhập tài khoản Google tùy chọn'}
                      </span>
                    </button>
                  )}

                  {onOpenApiKeySettings && (
                    <button
                      onClick={() => {
                        onOpenApiKeySettings();
                        onClose();
                      }}
                      className="w-full py-2 px-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-amber-200 font-medium text-[11px] flex items-center justify-center space-x-1.5 active:scale-95 transition"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Khóa Gemini API (Tùy chọn)</span>
                    </button>
                  )}
                </div>

                {showServerConfig && (
                  <div className="pt-2.5 border-t border-slate-800 space-y-2.5 animate-in fade-in duration-150">
                    {serverHistory.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Danh sách máy chủ đã lưu (Chạm để đổi nhanh):
                        </div>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {serverHistory.map((entry) => {
                            const isCurrent = activeCustomUrl === entry.url;
                            return (
                              <div
                                key={entry.url}
                                className={`flex items-center justify-between gap-1.5 p-2 rounded-lg border text-[11px] ${
                                  isCurrent
                                    ? 'bg-sky-950/50 border-sky-500/60 text-sky-200'
                                    : 'bg-[#11141d] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <button
                                  onClick={() => handleSelectSavedServer(entry)}
                                  className="flex-1 min-w-0 text-left"
                                >
                                  <div className="font-semibold truncate flex items-center space-x-1.5">
                                    <span>{entry.label}</span>
                                    {isCurrent && (
                                      <span className="text-[9px] text-emerald-400">✓ Đang dùng</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono truncate">
                                    {entry.url}
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleRemoveSavedServer(entry.url)}
                                  className="p-1.5 rounded hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 shrink-0"
                                  title="Xóa máy chủ khỏi danh sách"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block font-medium">
                        Thêm hoặc thay đổi URL Máy chủ (Render, Cloud Run, Wi-Fi LAN):
                      </label>
                      <input
                        type="text"
                        value={serverInputLabel}
                        onChange={(e) => setServerInputLabel(e.target.value)}
                        placeholder="Tên gợi nhớ (VD: Server Render chính)"
                        className="w-full bg-[#10131d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:border-sky-400"
                      />
                      <input
                        type="text"
                        value={serverInputUrl}
                        onChange={(e) => setServerInputUrl(e.target.value)}
                        placeholder="https://my-pydroid-server.onrender.com"
                        className="w-full bg-[#10131d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-100 font-mono focus:outline-none focus:border-sky-400"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={handleUseDefaultOffline}
                          className="px-2 py-1 text-[10.5px] text-slate-400 hover:text-white"
                        >
                          Mặc định (Offline)
                        </button>
                        <button
                          onClick={handleSaveCustomServer}
                          disabled={testingServer}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] flex items-center space-x-1 disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Lưu &amp; Kết nối</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Editor Font Size + Tô Màu Văn Bản (moved from Header gear) */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Cỡ Chữ Trình Soạn Thảo
              </div>
              <div className="p-2.5 bg-[#1a1e2a] rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cỡ chữ: {fontSize}px</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onChangeFontSize(-1)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      aria-label="Giảm cỡ chữ"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onChangeFontSize(1)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      aria-label="Tăng cỡ chữ"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onOpenSyntaxColor();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-amber-950/35 hover:bg-amber-900/45 border border-amber-600/40 text-amber-200 font-medium text-xs flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Tô Màu Văn Bản (Designer)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-[#11131a] border-t border-slate-800 text-center text-[10px] text-slate-400">
            Pydroid 3 Web • Môi trường phát triển Python &amp; AI Debugger
          </div>
        </div>
      </div>
    </div>
  );
};
