"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Photo {
  id: string
  src: string
  alt: string
}

interface Album {
  id: string
  title: string
  cover: string
  photos: Photo[]
}

const MOCK_ALBUMS: Album[] = [
  {
    id: "1",
    title: "Réunion familiale 2025",
    cover: "https://picsum.photos/seed/family1/400/300",
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: `a1p${i}`,
      src: `https://picsum.photos/seed/family1_${i}/800/600`,
      alt: `Photo ${i + 1} - Réunion familiale 2025`,
    })),
  },
  {
    id: "2",
    title: "Mariage de David",
    cover: "https://picsum.photos/seed/wedding1/400/300",
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: `a2p${i}`,
      src: `https://picsum.photos/seed/wedding1_${i}/800/600`,
      alt: `Photo ${i + 1} - Mariage de David`,
    })),
  },
  {
    id: "3",
    title: "Baptême de Sarah",
    cover: "https://picsum.photos/seed/baptism1/400/300",
    photos: Array.from({ length: 6 }, (_, i) => ({
      id: `a3p${i}`,
      src: `https://picsum.photos/seed/baptism1_${i}/800/600`,
      alt: `Photo ${i + 1} - Baptême de Sarah`,
    })),
  },
  {
    id: "4",
    title: "Anniversaire de Tonton",
    cover: "https://picsum.photos/seed/birthday1/400/300",
    photos: Array.from({ length: 10 }, (_, i) => ({
      id: `a4p${i}`,
      src: `https://picsum.photos/seed/birthday1_${i}/800/600`,
      alt: `Photo ${i + 1} - Anniversaire de Tonton`,
    })),
  },
  {
    id: "5",
    title: "Commémoration des ancêtres",
    cover: "https://picsum.photos/seed/ancestors1/400/300",
    photos: Array.from({ length: 7 }, (_, i) => ({
      id: `a5p${i}`,
      src: `https://picsum.photos/seed/ancestors1_${i}/800/600`,
      alt: `Photo ${i + 1} - Commémoration`,
    })),
  },
  {
    id: "6",
    title: "Voyage au village",
    cover: "https://picsum.photos/seed/village1/400/300",
    photos: Array.from({ length: 15 }, (_, i) => ({
      id: `a6p${i}`,
      src: `https://picsum.photos/seed/village1_${i}/800/600`,
      alt: `Photo ${i + 1} - Voyage au village`,
    })),
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function GaleriePage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setLightboxPhoto(null)
  }

  const openLightbox = (photo: Photo) => {
    setLightboxPhoto(photo)
    if (selectedAlbum) {
      setLightboxIndex(selectedAlbum.photos.findIndex((p) => p.id === photo.id))
    }
  }

  const closeLightbox = () => setLightboxPhoto(null)

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedAlbum) return
    const photos = selectedAlbum.photos
    const newIndex =
      direction === "prev"
        ? (lightboxIndex - 1 + photos.length) % photos.length
        : (lightboxIndex + 1) % photos.length
    setLightboxIndex(newIndex)
    setLightboxPhoto(photos[newIndex])
  }

  const backToAlbums = () => {
    setSelectedAlbum(null)
    setLightboxPhoto(null)
  }

  if (selectedAlbum && !lightboxPhoto) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={backToAlbums}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-emerald-800">{selectedAlbum.title}</h1>
          </div>
          <Button variant="gold">
            <Upload className="mr-2 h-4 w-4" />
            Ajouter des photos
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="columns-2 gap-4 sm:columns-3 lg:columns-4"
        >
          {selectedAlbum.photos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg transition-all hover:shadow-lg"
              onClick={() => openLightbox(photo)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }

  if (lightboxPhoto && selectedAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={backToAlbums}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-emerald-800">{selectedAlbum.title}</h1>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            key={lightboxPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => { e.stopPropagation(); navigateLightbox("prev") }}
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => { e.stopPropagation(); navigateLightbox("next") }}
            >
              <ChevronRight className="h-10 w-10" />
            </button>
            <button
              className="absolute right-4 top-4 text-white/80 hover:text-white"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="absolute bottom-4 text-sm text-white/60">
              {lightboxIndex + 1} / {selectedAlbum.photos.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">Galerie</h1>
        <Button variant="gold">
          <Upload className="mr-2 h-4 w-4" />
          Créer un album
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {MOCK_ALBUMS.map((album) => (
          <motion.div key={album.id} variants={itemVariants}>
            <Card
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => openAlbum(album)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900">{album.title}</h3>
                  <span className="flex items-center gap-1 text-sm text-zinc-500">
                    <Images className="h-4 w-4" />
                    {album.photos.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
