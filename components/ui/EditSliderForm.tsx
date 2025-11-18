"use client";

import React, { useEffect, useState } from "react";
import { useGetSliderById, useRenameSlider, useDeleteSlider } from "@/services/sliders";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import SliderImageManager from "@/components/SliderImageManager";

interface Props {
  sliderId: string;
}

const EditSliderForm: React.FC<Props> = ({ sliderId }) => {
  const router = useRouter();
  const { data: slider, isLoading, isError } = useGetSliderById(sliderId);
  const { mutate: renameSlider, isPending: isRenaming } = useRenameSlider();
  const { mutate: deleteSlider, isPending: isDeleting } = useDeleteSlider();

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (slider) setTitle(slider.title || "");
  }, [slider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slider) return;
    if (!title.trim()) {
      toast.error("Le titre ne peut pas être vide.");
      return;
    }

    renameSlider({ id: slider.id, title: title.trim() }, {
      onSuccess: () => {
        toast.success("Slider mis à jour.");
        router.push('/sliders');
      },
      onError: () => {
        toast.error("Erreur lors de la mise à jour.");
      }
    });
  };

  const handleDelete = () => {
    if (!slider) return;
    if (!confirm(`Confirmer la suppression du slider "${slider.title}" ?`)) return;
    deleteSlider(slider.id, {
      onSuccess: () => {
        toast.success("Slider supprimé.");
        router.push('/sliders');
      },
      onError: () => {
        toast.error("Erreur lors de la suppression.");
      }
    });
  };

  if (isLoading) return <div className="p-6 bg-white rounded-2xl"><Loader2 className="animate-spin" /></div>;
  if (isError || !slider) return <div className="p-6 bg-white rounded-2xl text-red-600">Impossible de charger le slider.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier le slider</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full py-3 px-4 border rounded" />
        </div>

        <div className="flex items-center space-x-3">
          <button type="submit" disabled={isRenaming} className="px-4 py-2 bg-primary-800 text-white rounded">
            {isRenaming ? <Loader2 className="animate-spin" /> : <Save />} {isRenaming ? 'En cours...' : 'Enregistrer'}
          </button>
          <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded">
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />} Supprimer
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Gérer les images</h2>
        <SliderImageManager slider={slider} onClose={() => {}} />
      </div>
    </div>
  );
};

export default EditSliderForm;
