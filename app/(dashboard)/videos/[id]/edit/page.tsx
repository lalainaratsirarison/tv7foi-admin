"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetVideoById, useUpdateVideo } from "@/services/videos";
import { VideoCategory } from "@/types";

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Récupère les infos de la vidéo depuis le backend
  const { data: video, isLoading, isError } = useGetVideoById(id);

  // Hook de mise à jour
  const { mutate: updateVideo, isPending } = useUpdateVideo();

  // États locaux pour le formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<VideoCategory | undefined>();

  // Pré-remplit le formulaire quand la vidéo est chargée
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setCategory(video.category ?? undefined);
    }
  }, [video]);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideo({ id, data: {title, description, category} });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-primary-800 animate-spin" />
        <p className="text-lg ml-4">Chargement de la vidéo...</p>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="text-center mt-10 text-red-600">
        Impossible de charger la vidéo.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center space-x-4">
        <Link href="/videos" className="p-3 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">
          Modifier la vidéo (ID: {id})
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-3xl shadow-lg space-y-6"
      >
        {/* Champ Titre */}
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Titre de la vidéo
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Titre impactant"
          />
        </div>

        {/* Champ Catégorie (Select) */}
        <div>
          <label
            htmlFor="category"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as VideoCategory)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition bg-white"
          >
            <option value="">Sélectionner une catégorie</option>
            {Object.values(VideoCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Champ Description (Textarea) */}
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Courte description du contenu..."
          />
        </div>
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="py-5 px-10 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Enregistrer les changement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
