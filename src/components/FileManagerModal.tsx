import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  FilePlus,
  Save,
  Download,
  Upload,
  RotateCcw,
  Search,
  Copy,
  Check,
  FileCode2,
  Pencil,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { CodeFile } from '../types';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: CodeFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCreateFile: (filename: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onCloseFile: (id: string) => void;
  onSaveToLocal: () => void;
  onDownloadPy: () => void;
  onUploadPy: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetCode: () => void;
  onOpenEditorSearch: () => void;
  onCopyAllCode: () => void;
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onCloseFile,
  onSaveToLocal,
  onDownloadPy,
  onUploadPy,
  onResetCode,
  onOpenEditorSearch,
  onCopyAllCode,
}) => {
  const [newFileName, setNewFileName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFileName.trim();
    if (!trimmed) return;
    onCreateFile(trimmed);
    setNewFileName('');
    setShowNewInput(false);
    setNotice(`Đã tạo và mở tệp ${trimmed.endsWith('.py') ? trimmed : `${trimmed}.py`}`);
  };

  const handleStartRename = (file: CodeFile) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleSaveRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      onRenameFile(id, trimmed);
      setNotice(`Đã đổi tên tệp thành ${trimmed.endsWith('.py') ? trimmed : `${trimmed}.py`}`);
    }
    setRenamingId(null);
  };

  const handleCopy = () => {
    onCopyAllCode();
    setCopied(true);
    setNotice('Đã sao chép toàn bộ mã nguồn vào khay nhớ tạm!');
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveLocal = () => {
    onSaveToLocal();
    setNotice('Đã lưu tất cả tệp mã nguồn vào bộ nhớ máy!');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[88vh] bg-[#151822] border-t sm:border border-slate-700/80 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 pb-[env(safe-area-inset-bottom,0px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1a1f2c] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <FolderOpen className="w-4.5 h-4.5 text-sky-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-100">Tệp &amp; Mã Nguồn</h2>
              <p className="text-[11px] text-slate-400">
                Đang mở: <span className="text-sky-300 font-mono">{activeFile?.name}</span> ({files.length} tệp)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Đóng quản lý tệp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notice && (
            <div className="px-3 py-2 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* Open Files Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Danh Sách Tệp Đang Mở
              </span>
              <button
                onClick={() => setShowNewInput((v) => !v)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>Tạo file mới</span>
              </button>
            </div>

            {showNewInput && (
              <form
                onSubmit={handleCreateSubmit}
                className="flex items-center space-x-2 p-2 rounded-xl bg-[#10131b] border border-emerald-600/40"
              >
                <input
                  type="text"
                  autoFocus
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Tên file mới (VD: may_tinh.py)"
                  className="flex-1 bg-transparent px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Tạo
                </button>
              </form>
            )}

            <div className="rounded-xl bg-[#10131b] border border-slate-800 divide-y divide-slate-800/80 max-h-48 overflow-y-auto">
              {files.map((file) => {
                const isActive = file.id === activeFileId;
                const isRenaming = renamingId === file.id;
                return (
                  <div
                    key={file.id}
                    className={`px-3 py-2.5 flex items-center justify-between gap-2 transition ${
                      isActive ? 'bg-sky-950/35' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {isRenaming ? (
                      <div className="flex-1 flex items-center space-x-1.5">
                        <input
                          type="text"
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(file.id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="flex-1 bg-[#181d29] border border-sky-500/60 rounded-lg px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveRename(file.id)}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-semibold"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectFile(file.id);
                          onClose();
                        }}
                        className="flex-1 min-w-0 flex items-center space-x-2.5 text-left"
                      >
                        <FileCode2
                          className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`}
                        />
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-mono truncate ${
                              isActive ? 'text-sky-300 font-bold' : 'text-slate-200'
                            }`}
                          >
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {file.content.split('\n').length} dòng
                            {isActive ? ' • Đang chỉnh sửa' : ''}
                          </div>
                        </div>
                      </button>
                    )}

                    {!isRenaming && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleStartRename(file)}
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition"
                          title="Đổi tên tệp"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {files.length > 1 && (
                          <button
                            onClick={() => onCloseFile(file.id)}
                            className="p-2 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
                            title="Đóng tệp"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* File & Editor Quick Actions */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Thao Tác Tệp &amp; Trình Soạn Thảo
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSaveLocal}
                className="min-h-11 px-3 py-2.5 rounded-xl bg-[#1a1e2a] hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2.5 transition active:scale-[0.98]"
              >
                <Save className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Lưu mã nguồn (Bộ nhớ máy)</span>
              </button>

              <button
                onClick={() => {
                  onDownloadPy();
                  setNotice(`Đang tải xuống ${activeFile?.name || 'main.py'}...`);
                }}
                className="min-h-11 px-3 py-2.5 rounded-xl bg-[#1a1e2a] hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2.5 transition active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tải file .py về điện thoại</span>
              </button>

              <label className="min-h-11 px-3 py-2.5 rounded-xl bg-[#1a1e2a] hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2.5 transition cursor-pointer active:scale-[0.98]">
                <Upload className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Mở file .py từ điện thoại</span>
                <input
                  type="file"
                  accept=".py,.txt"
                  onChange={(e) => {
                    onUploadPy(e);
                    onClose();
                  }}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  onClose();
                  onOpenEditorSearch();
                }}
                className="min-h-11 px-3 py-2.5 rounded-xl bg-[#1a1e2a] hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2.5 transition active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Tìm kiếm &amp; Thay thế</span>
              </button>

              <button
                onClick={handleCopy}
                className="min-h-11 px-3 py-2.5 rounded-xl bg-[#1a1e2a] hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2.5 transition active:scale-[0.98]"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span>{copied ? 'Đã sao chép mã nguồn' : 'Sao chép toàn bộ mã'}</span>
              </button>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="min-h-11 px-3 py-2.5 rounded-xl bg-rose-950/25 hover:bg-rose-950/45 border border-rose-800/40 text-xs text-rose-300 flex items-center space-x-2.5 transition active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Khôi phục mã ban đầu</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-2 text-xs">
                  <span className="text-rose-200 font-medium">Xác nhận khôi phục?</span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        onResetCode();
                        setConfirmReset(false);
                        setNotice('Đã khôi phục mã nguồn ban đầu.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold"
                    >
                      Khôi phục
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
