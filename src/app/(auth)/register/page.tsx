"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, CheckCircle, Upload, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const registerSchema = z
  .object({
    nom: z.string().min(1, "Nom requis"),
    prenoms: z.string().min(1, "Prénoms requis"),
    telephone: z.string().min(1, "Téléphone requis"),
    email: z.string().optional().or(z.literal("")),
    dateNaissance: z.string().min(1, "Date de naissance requise"),
    password: z.string().min(6, "Minimum 6 caractères"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
    lienParente: z.string().min(1, "Lien de parenté requis"),
    village: z.string().min(1, "Village ou localité requis"),
    parrain: z.string().optional().or(z.literal("")),
    photo: z
      .any()
      .optional()
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        "La photo ne doit pas dépasser 5 Mo"
      )
      .refine(
        (file) =>
          !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
        "Format accepté : JPEG, PNG, WebP ou GIF"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => !data.email || z.string().email().safeParse(data.email).success, {
    message: "Email invalide",
    path: ["email"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchPhoto = watch("photo")

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoError(null)

    if (!file) {
      setPhotoPreview(null)
      setValue("photo", undefined as any)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError("La photo ne doit pas dépasser 5 Mo")
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError("Format accepté : JPEG, PNG, WebP ou GIF")
      return
    }

    setValue("photo", file as any)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    setPhotoError(null)
    setValue("photo", undefined as any)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = async (_data: RegisterFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSuccess(true)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center py-16 px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="mb-4 h-16 w-16 text-emerald-600" />
            </motion.div>
            <CardTitle className="mb-2 text-emerald-800">
              Inscription envoyée
            </CardTitle>
            <CardDescription className="mb-4 text-sm">
              Votre compte doit être validé par un administrateur avant de
              pouvoir accéder à la plateforme.
            </CardDescription>
            <CardDescription className="mb-6 text-xs text-zinc-400">
              Vous recevrez un email dès que votre compte sera activé.
            </CardDescription>
            <Link href="/login">
              <Button variant="gold">Retour à la connexion</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <Card className="border-0 shadow-2xl">
        <CardHeader className="items-center pb-2 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-emerald-800">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center">
              Rejoignez votre espace familial
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Important :</strong> Votre compte doit être validé par un
                administrateur avant de pouvoir accéder à la plateforme. Vous
                recevrez une notification après validation.
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nom"
                  placeholder="Votre nom"
                  {...register("nom")}
                />
                {errors.nom && (
                  <p className="text-sm text-red-500">{errors.nom.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenoms">
                  Prénoms <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prenoms"
                  placeholder="Vos prénoms"
                  {...register("prenoms")}
                />
                {errors.prenoms && (
                  <p className="text-sm text-red-500">
                    {errors.prenoms.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telephone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="+225 01 02 03 04 05"
                  {...register("telephone")}
                />
                {errors.telephone && (
                  <p className="text-sm text-red-500">
                    {errors.telephone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com (optionnel)"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">
                  Date de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  {...register("dateNaissance")}
                />
                {errors.dateNaissance && (
                  <p className="text-sm text-red-500">
                    {errors.dateNaissance.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lienParente">
                  Lien de parenté <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lienParente"
                  placeholder='Ex: "fils de", "cousin de", "nièce de"'
                  {...register("lienParente")}
                />
                {errors.lienParente && (
                  <p className="text-sm text-red-500">
                    {errors.lienParente.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="village">
                  Village ou localité d&apos;origine{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="village"
                  placeholder="Votre village ou localité"
                  {...register("village")}
                />
                {errors.village && (
                  <p className="text-sm text-red-500">
                    {errors.village.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="parrain">
                  Parrain - Nom du parrain
                </Label>
                <Input
                  id="parrain"
                  placeholder="Recommandé par (optionnel)"
                  {...register("parrain")}
                />
                {errors.parrain && (
                  <p className="text-sm text-red-500">
                    {errors.parrain.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo de profil</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="cursor-pointer file:cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                </div>
                {photoPreview && (
                  <div className="relative shrink-0">
                    <img
                      src={photoPreview}
                      alt="Aperçu"
                      className="h-14 w-14 rounded-full border-2 border-emerald-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {photoError && (
                <p className="text-sm text-red-500">{photoError}</p>
              )}
              {errors.photo && (
                <p className="text-sm text-red-500">
                  {errors.photo.message as string}
                </p>
              )}
              <p className="text-xs text-zinc-400">
                Formats acceptés : JPEG, PNG, WebP, GIF (max 5 Mo)
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 caractères"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Retaper votre mot de passe"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>

            <div className="flex justify-center pt-2">
              <Link
                href="/login"
                className="text-sm text-emerald-800 hover:text-emerald-600 hover:underline"
              >
                Déjà un compte ? Connectez-vous
              </Link>
            </div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
