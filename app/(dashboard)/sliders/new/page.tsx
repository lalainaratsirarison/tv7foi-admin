"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateSlider, Image } from "@/services/sliders"; // 💡 Utilise le service slider corrigé
import { useGetImages } from "@/services/images"; // 💡 Utilise le nouveau service images
import { Loader2, Save, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function NewSliderPage() {
  const router = useRouter();
  
  // --- États Locaux ---
  const [title, setTitle] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());

  // --- Hooks de Données ---
  const { data: availableImages, isLoading: isLoadingImages } = useGetImages();
  const { mutate: createSlider, isPending: isCreating } = useCreateSlider();

  // --- Gestionnaires ---

  // Gère la sélection/désélection d'une image
  const toggleImageSelection = (image: Image) => {
    // Crée une nouvelle copie du Set pour forcer la mise à jour de l'état
    setSelectedImageIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(image.id)) {
        newIds.delete(image.id);
      } else {
        newIds.add(image.id);
      }
      return newIds;
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return toast.error("Le titre est obligatoire.");
    }
    if (selectedImageIds.size === 0) {
      return toast.error("Veuillez sélectionner au moins une image.");
    }

    // 1. Filtrer les objets Image complets basé sur les IDs sélectionnés
    const selectedImages = availableImages?.filter(img => selectedImageIds.has(img.id)) || [];
    
    // 2. Formater les données pour le backend (uniquement ce dont il a besoin)
    const imagesPayload = selectedImages.map(img => ({
      path: img.path,
      alt: img.alt,
      title: img.title
    }));

    // 3. Appeler la mutation avec le payload JSON correct
    createSlider({
      title: title.trim(),
      images: imagesPayload
    }, {
      onSuccess: () => {
        toast.success("Slider créé avec succès !");
        router.push("/sliders");
      },
      onError: (error: any) => {
        // Gérer l'erreur de nom unique (409 Conflict)
        if (error.response?.status === 409) {
          toast.error(error.response.data.message || "Ce titre existe déjà.");
        } else {
          toast.error("Échec de la création du slider.");
        }
        console.error(error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/sliders" className="p-3 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Créer un nouveau Slider</h1>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 lg:p-12 rounded-3xl shadow-lg space-y-8"
      >
        {/* 1. Champ Titre */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            Titre du Slider
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCreating}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Ex: Page d'accueil principal"
          />
        </div>

        {/* 2. Sélecteur d'Images */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Sélectionner les images
          </label>
          <p className="text-sm text-gray-500 mb-4">
            (Ces images doivent être uploadées via la section "Médiathèque" ou "Images" d'abord)
          </p>
          
          {isLoadingImages ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 border rounded-2xl">
              {availableImages?.map((image) => {
                const isSelected = selectedImageIds.has(image.id);
                return (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => toggleImageSelection(image)}
                    disabled={isCreating}
                    className={`relative rounded-lg overflow-hidden border-4 focus:outline-none transition-all
                      ${isSelected ? 'border-primary-600 ring-4 ring-primary-200' : 'border-transparent hover:border-gray-300'}
                    `}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={process.env.NEXT_PUBLIC_STATIC_URL + image.path} // Assurez-vous que le path est l'URL accessible
                      alt={image.alt || image.title || "Image de la médiathèque"}
                      className="w-full h-24 object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-0.5 bg-primary-600 text-white rounded-full">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Bouton de soumission */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isCreating || isLoadingImages}
            className="py-5 px-10 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Création...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Enregistrer le Slider</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}