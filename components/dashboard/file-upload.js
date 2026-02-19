'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export function FileUpload({ onFileUploaded, buttonLabel = 'Importer' }) {
  const { session } = useAuth()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]

      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
        toast.error('Format de fichier non supporte. Utilisez CSV ou Excel.')
        return
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Taille maximale : 50MB')
        return
      }

      setFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return

    if (!session?.access_token) {
      toast.error('Session expiree. Veuillez vous reconnecter.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const data = await response.json()
      toast.success('Fichier uploade avec succes !')

      if (onFileUploaded) {
        onFileUploaded(data)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-3">
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            'relative overflow-hidden group/upload rounded-2xl border-2 border-dashed p-4 lg:p-8 text-center cursor-pointer transition-all duration-700 glass-card min-h-[160px] lg:min-h-[180px] flex flex-col items-center justify-center touch-manipulation',
            isDragActive
              ? 'border-brand-primary bg-brand-primary/10 scale-[0.99] shadow-inner shadow-brand-primary/20'
              : 'border-white/10 hover:border-brand-primary/40 hover:bg-white/5 shadow-2xl shadow-black/40'
          )}
        >
          {/* Animated Background Orbs */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl group-hover/upload:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-cotton/10 rounded-full blur-2xl group-hover/upload:scale-150 transition-transform duration-1000" />

          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 lg:gap-4 relative z-10">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-xl group-hover/upload:opacity-100 opacity-0 transition-opacity duration-700" />
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-cotton/20 flex items-center justify-center border border-white/10 shadow-xl group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-500">
                <Upload className={cn(
                  "h-6 w-6 lg:h-8 lg:w-8 transition-colors duration-500",
                  isDragActive ? "text-brand-primary" : "text-white/40 group-hover/upload:text-brand-primary"
                )} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base lg:text-xl font-display font-black tracking-tight text-white">
                {isDragActive ? 'Lâchez le fichier...' : 'Déposez votre dataset'}
              </p>
              <p className="text-xs lg:text-sm text-white/40 font-display font-medium max-w-xs mx-auto">
                {isDragActive
                  ? 'On s\'occupe du reste.'
                  : 'Faites glisser vos fichiers CSV ou Excel ici pour un audit instantané.'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 font-display">
              <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.15em]">
                Formats autorisés
              </p>
              <p className="text-[10px] text-brand-primary font-bold">
                CSV, XLS, XLSX • Max 50MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 lg:p-6 rounded-2xl border-brand-primary/20 relative overflow-hidden group/file">
          <div className="absolute top-0 right-0 p-2 lg:p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={uploading}
              className="h-8 w-8 rounded-full hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-all"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-brand-primary/20 rounded-xl blur-md" />
              <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/30 shadow-xl">
                <File className="h-7 w-7 lg:h-8 lg:w-8 text-brand-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base lg:text-lg font-display font-black text-white truncate mb-0.5">
                {file.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] text-brand-cotton font-bold uppercase tracking-widest">
                  Prêt pour l'importation
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {file && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full lg:w-auto px-6 lg:px-8 h-10 lg:h-11 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase text-[10px] tracking-[0.12em] shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-2" />
                {buttonLabel}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={removeFile}
            disabled={uploading}
            className="w-full lg:w-auto px-6 h-9 rounded-xl font-display font-bold uppercase text-[9px] tracking-widest text-white/40 hover:text-white"
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  )
}
