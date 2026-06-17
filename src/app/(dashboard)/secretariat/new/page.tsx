"use client"

import { useState } from "react"
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
  X,
  Loader2,
  Save,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const documentSchema = z.object({
  titre: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  type: z.enum(
    ["proces_verbal", "compte_rendu", "reglement", "autre"],
    { message: "Veuillez sélectionner un type" }
  ),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2 000 caractères"),
})

type DocumentFormData = z.infer<typeof documentSchema>

export default function NewDocumentPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      titre: "",
      type: undefined,
      description: "",
    },
  })

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const onSubmit = async (_data: DocumentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/secretariat")
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-zinc-500"
      >
        <Link href="/secretariat" className="hover:text-emerald-800">
          Secrétariat Général
        </Link>
        <span>/</span>
        <span className="text-zinc-900">Nouveau document</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/secretariat">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-emerald-800">
            Nouveau document
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
              <Label htmlFor="titre">Titre du document *</Label>
              <Input
                id="titre"
                placeholder="Ex: Procès-verbal de l'assemblée générale 2026"
                {...register("titre")}
              />
              {errors.titre && (
                <p className="text-sm text-red-500">{errors.titre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de document *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as DocumentFormData["type"])
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proces_verbal">
                    Procès-verbal
                  </SelectItem>
                  <SelectItem value="compte_rendu">
                    Compte rendu
                  </SelectItem>
                  <SelectItem value="reglement">Règlement</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez brièvement le contenu du document..."
                rows={5}
                className="min-h-[120px] resize-y"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">
              Fichier (PDF)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-800" />
                  <div>
                    <p className="text-sm font-medium text-zinc-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500"
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
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                  isDragOver
                    ? "border-emerald-800 bg-emerald-50"
                    : "border-zinc-300 hover:border-zinc-400"
                }`}
              >
                <Upload className="mb-4 h-10 w-10 text-zinc-400" />
                <p className="mb-1 text-sm font-medium text-zinc-600">
                  Glissez un fichier PDF ici ou cliquez pour parcourir
                </p>
                <p className="text-xs text-zinc-400">PDF uniquement (max. 10 Mo)</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-end gap-4 pb-8">
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
