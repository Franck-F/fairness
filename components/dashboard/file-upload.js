'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export function FileUpload({ onFileUploaded }) {
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
    <div className="space-y-4">
      {!file ? (
        <Card
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed p-12 text-center cursor-pointer transition-colors bg-card',
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Deposez le fichier ici' : 'Glissez-deposez un fichier CSV ou Excel'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ou cliquez pour selectionner un fichier
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Formats supportes : CSV, XLS, XLSX | Taille max : 50MB
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} disabled={uploading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {file && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={removeFile} disabled={uploading}>
            Annuler
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmer l'upload
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
