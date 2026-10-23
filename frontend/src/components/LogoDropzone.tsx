import { useEffect, useRef, useState } from 'react';

type Props = {
  isDark: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
};

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
const maxSizeBytes = 2 * 1024 * 1024;

export default function LogoDropzone({ isDark, file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Client-side checks are only for UX, the server is the authority.
  const selectFile = (selected: File | undefined) => {
    if (!selected) return;
    if (!allowedTypes.includes(selected.type)) {
      setError('Only PNG, JPEG or WebP images are allowed.');
      return;
    }
    if (selected.size > maxSizeBytes) {
      setError('The image must be 2 MB or smaller.');
      return;
    }
    setError(null);
    onChange(selected);
  };

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const zoneClasses = isDragging
    ? 'border-violet-400 bg-violet-500/10'
    : isDark
      ? 'border-slate-700 bg-slate-800'
      : 'border-slate-200 bg-white';

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-5 text-center transition ${zoneClasses}`}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Logo preview" className="h-20 w-20 rounded-2xl object-cover" />
            <p className={`max-w-full truncate text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{file?.name}</p>
            <button type="button" onClick={handleRemove} className="rounded-2xl border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10">Remove</button>
          </>
        ) : (
          <>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Drag & drop a logo here</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>or click to choose a file (PNG, JPEG, WebP, up to 2 MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}