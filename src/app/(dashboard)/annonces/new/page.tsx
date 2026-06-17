"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Upload,
  File,
  Image,
  X,
  Loader2,
  Save,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const annonceSchema = z.object({
  titre: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  contenu: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .max(10000, "Le contenu ne peut pas dépasser 10 000 caractères"),
})

type AnnonceFormData = z.infer<typeof annonceSchema>

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnnonceFormData>({
    resolver: zodResolver(annonceSchema),
    defaultValues: {
      titre: "",
      contenu: "",
    },
  })

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleDocumentDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.type.includes("word") ||
          f.type.includes("sheet") ||
          f.type.includes("presentation") ||
          f.name.endsWith(".doc") ||
          f.name.endsWith(".docx") ||
          f.name.endsWith(".pdf") ||
          f.name.endsWith(".xls") ||
          f.name.endsWith(".xlsx")
      )
      setDocumentFiles((prev) => [...prev, ...files])
    },
    []
  )

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDocumentFiles((prev) => [...prev, ...files])
  }

  const removeDocument = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (_data: AnnonceFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/annonces")
  }

  const onSaveDraft = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/annonces")
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-zinc-500"
      >
        <Link href="/annonces" className="hover:text-emerald-800">
          Annonces
        </Link>
        <span>/</span>
        <span className="text-zinc-900">Nouvelle annonce</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/annonces">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-emerald-800">
            Nouvelle annonce
          </h1>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de l'annonce *</Label>
              <Input
                id="titre"
                placeholder="Ex: Réunion familiale annuelle 2026"
                {...register("titre")}
              />
              {errors.titre && (
                <p className="text-sm text-red-500">{errors.titre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu">Contenu *</Label>
              <Textarea
                id="contenu"
                placeholder="Rédigez le contenu de votre annonce..."
                rows={10}
                className="min-h-[200px] resize-y"
                {...register("contenu")}
              />
              {errors.contenu && (
                <p className="text-sm text-red-500">
                  {errors.contenu.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">
              Image à la une
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="max-h-64 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById("image-upload")?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                  isDragOver
                    ? "border-emerald-800 bg-emerald-50"
                    : "border-zinc-300 hover:border-zinc-400"
                }`}
              >
                <Image className="mb-4 h-10 w-10 text-zinc-400" />
                <p className="mb-1 text-sm font-medium text-zinc-600">
                  Glissez une image ici ou cliquez pour parcourir
                </p>
                <p className="text-xs text-zinc-400">
                  PNG, JPG ou WEBP (max. 5 Mo)
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">
              Documents joints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDocumentDrop}
              onClick={() =>
                document.getElementById("document-upload")?.click()
              }
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                isDragOver
                  ? "border-emerald-800 bg-emerald-50"
                  : "border-zinc-300 hover:border-zinc-400"
              }`}
            >
              <Upload className="mb-4 h-8 w-8 text-zinc-400" />
              <p className="mb-1 text-sm font-medium text-zinc-600">
                Glissez des documents ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-zinc-400">
                PDF, Word, Excel (max. 10 Mo par fichier)
              </p>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
                className="hidden"
                onChange={handleDocumentSelect}
              />
            </div>

            {documentFiles.length > 0 && (
              <div className="space-y-2">
                {documentFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-emerald-800" />
                      <div>
                        <p className="text-sm font-medium text-zinc-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {(file.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="rounded-full p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer comme brouillon
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publication...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publier
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
