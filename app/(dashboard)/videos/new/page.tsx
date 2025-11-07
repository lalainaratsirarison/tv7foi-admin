"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateVideo } from "@/services/videos";
import { VideoCategory } from "@/types";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function NewVideoPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<VideoCategory | undefined>();

  const { mutate: createVideo, isPending } = useCreateVideo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VÉRIFICATION ESSENTIELLE ---
    if (!title || !description || !category || !selectedFile) {
      alert("Veuillez remplir tous les champs et sélectionner une vidéo.");
      return;
    }

    // --- CRÉATION DE FORMDATA (Le Cœur du Changement) ---
    const formData = new FormData();
    
    // 1. Ajouter les champs de texte
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    // 2. Ajouter le fichier (Le nom du champ 'video' doit correspondre au single('video') du backend)
    formData.append("video", selectedFile);
    
    // --- APPEL DE LA MUTATION ---
    createVideo(formData as unknown as any, { // On passe l'objet FormData (typage forcé pour l'upload)
      onSuccess: () => {
        console.log(formData);
        // Redirige vers la liste et affiche un message de succès (optionnel)
        router.push("/videos");
        alert("Vidéo ajoutée avec succès !");
      },
      onError: (error) => {
        console.error("Échec de l'ajout de la vidéo:", error);
        // @TODO: Afficher l'erreur à l'utilisateur
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/videos" className="p-3 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">
          Ajouter une nouvelle vidéo
        </h1>
      </div>

      {/* Le formulaire est large (max-w-4xl) et spacieux (space-y-8)
        Les inputs respectent le design (py-5, text-lg, rounded-2xl)
      */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 lg:p-12 rounded-3xl shadow-lg space-y-8"
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

        {/* @TODO: Section d'Upload
          Remplacé par un placeholder pour le moment
        */}
          <div className="flex flex-col space-y-4">
            <label htmlFor="video-upload" className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center cursor-pointer hover:border-primary-500 transition-all"
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setSelectedFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <p className="text-lg font-medium text-gray-600">
                {selectedFile ? `Fichier sélectionné : ${selectedFile.name}` : "Glissez-déposez ou cliquez pour uploader une vidéo"}
              </p>
              <p className="text-sm text-gray-400">Formats acceptés : mp4, mov, avi</p>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </label>
            {selectedFile && (
              <div className="text-sm text-green-600 mt-2">Vidéo prête à être envoyée.</div>
            )}
          </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="py-5 px-10 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Enregistrer la vidéo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
