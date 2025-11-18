"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetVideos, useDeleteVideo } from "@/services/videos";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import {
  Plus,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function VideosPage() {
  const { data: videos, isLoading, isError } = useGetVideos();
  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteVideo();

  const [modalOpen, setModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setTargetId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTargetId(null);
  };

  const handleConfirmDelete = () => {
    if (!targetId) return;
    deleteVideo(targetId, {
      onSuccess: () => closeModal(),
      onError: () => closeModal(),
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Vidéos</h1>
        <Link
          href="/videos/new"
          className="py-4 px-6 text-lg font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={24} />
          <span>Ajouter une vidéo</span>
        </Link>
      </div>

      {/* États */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-primary-800 animate-spin" />
        </div>
      )}
      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl" role="alert">
          <p className="font-bold text-xl">Erreur de chargement</p>
          <p className="text-lg">Impossible de récupérer les vidéos.</p>
        </div>
      )}

      {/* Grille */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos?.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={process.env.NEXT_PUBLIC_STATIC_URL + video.thumbnail}
                  alt={video.title || "Miniature"}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <span className="text-sm font-medium text-primary-700 mb-1">
                  {video.category || "Sans catégorie"}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {video.title || "Sans titre"}
                </h3>
                <p className="text-gray-600 line-clamp-3 flex-1">
                  {video.description || "Aucune description"}
                </p>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <Link
                  title="Modifier"
                  href={`/videos/${video.id}/edit`}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit size={18} />
                </Link>
                <button
                  title="Supprimer"
                  onClick={() => openModal(video.id)}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && videos?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700">Aucune vidéo trouvée</h2>
          <p className="text-gray-500 mt-2">Commencez par ajouter une nouvelle vidéo.</p>
        </div>
      )}

      {/* Modal de confirmation */}
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Supprimer cette vidéo ?"
        description="La vidéo sera définitivement supprimée. Cette action est irréversible."
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
        cancelLabel="Annuler"
      />
    </div>
  );
}
