import { useState, useRef, type ChangeEvent } from 'react'
import { UploadCloud, X, File as FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
  className?: string
}

export function FileUpload({ onFileSelect, accept, maxSizeMB = 10, disabled, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null)
    const selected = e.target.files?.[0]
    if (!selected) return

    if (maxSizeMB && selected.size > maxSizeMB * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSizeMB}MB`)
      return
    }

    setFile(selected)
    onFileSelect(selected)
  }

  function clearFile() {
    setFile(null)
    setError(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />

      {!file ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center transition-colors',
            disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-surface-container-low border-border hover:border-primary/50'
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">点击上传附件</p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept ? `支持 ${accept} 格式` : '支持常见文件格式'}，最大 {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-surface p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileIcon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
            disabled={disabled}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
