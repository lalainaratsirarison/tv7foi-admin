"use client";

import { useState } from "react";
import { useGetImages, useDeleteImage, Image } from "@/services/images";
import { Loader2, Plus, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal"; // Assurez-vous que ce chemin est correct
import Link from "next/link";

// 💡 Leçon : Ce composant gère l'upload (multipart/form-data)
// et l'affichage (grid d'images)

export default function ImagesPage() {
  // --- Hooks de Données ---
  const { data: images, isLoading: isLoadingImages, isError } = useGetImages();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();

  // --- États pour la Modale de Suppression ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  

  // --- Gestion de la Suppression ---
  const openDeleteModal = (image: Image) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedImage) return;
    deleteImage(selectedImage.id, {
      onSuccess: () => {
        toast.success("Image supprimée.");
        setIsDeleteModalOpen(false);
        setSelectedImage(null);
      },
      onError: () => {
        toast.error("Erreur lors de la suppression.");
        setIsDeleteModalOpen(false);
      }
    });
  };

  return (
    <>
      <div className="space-y-10">
        <h1 className="text-4xl font-bold text-gray-900">Médiathèque</h1>

        {/* Toolbar : bouton pour aller vers la page d'ajout */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-lg">
          <div>
            <p className="text-lg font-medium text-gray-700">Gérer les images de la médiathèque</p>
            <p className="text-sm text-gray-400">Supprimer ou modifier une image existante. Pour ajouter une nouvelle image, utilisez le bouton "Ajouter".</p>
          </div>
          <div>
            <Link href="/images/new" className="inline-flex items-center space-x-2 bg-primary-800 text-white py-3 px-4 rounded-2xl hover:bg-primary-700">
              <Plus />
              <span>Ajouter une image</span>
            </Link>
          </div>
        </div>

        {/* --- Galerie d'Images --- */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Images existantes</h2>
          
          {isLoadingImages && <Loader2 className="mx-auto w-8 h-8 text-primary-800 animate-spin" />}
          
          {isError && (
            <div className="flex items-center text-red-600">
                <AlertTriangle className="mr-2" /> Erreur de chargement des images.
            </div>
          )}
          
          {!isLoadingImages && !isError && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {console.log(images) as any}
              {images?.map((image) => (
                <div key={image.id} className="relative group rounded-2xl overflow-hidden shadow-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={process.env.NEXT_PUBLIC_STATIC_URL + image.path} 
                    alt={image.alt || "Image"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => openDeleteModal(image)}
                      disabled={isDeleting}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      title="Supprimer cette image"
                    >
                      {isDeleting && selectedImage?.id === image.id ? <Loader2 className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                  {/* Info (optionnel) */}
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-black/50 text-white text-xs truncate">
                    {image.title || image.path.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Modale de Suppression --- */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer l'image "${selectedImage?.title || selectedImage?.path}" ? Cette action est irréversible et supprimera le fichier du serveur.`}
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
      />
    </>
  );
}