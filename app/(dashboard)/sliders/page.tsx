"use client";

import { useState } from "react";
import { 
  useGetSliders, 
  useDeleteSlider, 
  useRenameSlider, 
  useActivateSlider, 
  Slider 
} from "@/services/sliders"; // useCreateSlider a été retiré
import SliderImageManager from "@/components/SliderImageManager";
// --- Composants UI ---
import Modal from "@/components/ui/Modal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal"; // CORRIGÉ : utilise le chemin d'alias /ui
import RenameCategoryModal from "@/components/RenameCategoryModal"; // CORRIGÉ : utilise le chemin d'alias /ui
// ---------------------
import { Loader2, Plus, Edit, Trash2, CheckCircle, Power, Image } from "lucide-react";
import toast from "react-hot-toast";


export default function SlidersPage() {
  // --- Hooks de Données ---
  const { data: sliders, isLoading, isError } = useGetSliders();
  const { mutate: deleteSlider, isPending: isDeleting } = useDeleteSlider();
  const { mutate: renameSlider, isPending: isRenaming } = useRenameSlider();
  const { mutate: activateSlider, isPending: isActivating } = useActivateSlider();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);

  // --- Gestionnaires (Handlers) ---

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsRenameModalOpen(false);
    setIsImageManagerOpen(false);
    setSelectedSlider(null);
  };
  
  // Suppression
  const openDeleteModal = (slider: Slider) => {
    setSelectedSlider(slider);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (!selectedSlider) return;
    deleteSlider(selectedSlider.id, {
      onSuccess: () => {
        toast.success(`Slider "${selectedSlider.title}" supprimé.`);
        closeModal();
      },
      onError: () => {
        toast.error("Erreur lors de la suppression.");
        closeModal();
      }
    });
  };

  // Renommage
  const openRenameModal = (slider: Slider) => {
    setSelectedSlider(slider);
    setIsRenameModalOpen(true);
  };
  const handleRenameConfirm = (newTitle: string) => {
    if (!selectedSlider) return;
    renameSlider({ id: selectedSlider.id, title: newTitle }, {
      onSuccess: () => {
        toast.success(`Slider renommé en "${newTitle}".`);
        closeModal();
      },
      onError: () => {
        toast.error("Erreur lors du renommage.");
        closeModal();
      }
    });
  };
  
  // Activation
  const handleActivate = (slider: Slider) => {
    if (slider.isActive) return;
    activateSlider(slider.id, {
        onSuccess: () => {
            toast.success(`Slider "${slider.title}" activé.`);
        },
        onError: () => {
            toast.error("Erreur lors de l'activation.");
        }
    });
  };

  // Gestion des images
  const openImageManager = (slider: Slider) => {
    setSelectedSlider(slider);
    setIsImageManagerOpen(true);
  };

  // État de chargement global pour les actions
  const isActionLoading = isDeleting || isRenaming || isActivating;

  return (
    <>
      <div className="space-y-10">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Sliders</h1>

        {/* Bouton pour ouvrir la modale de création (Remplace le formulaire intégré) */}
        <div className="flex justify-end">
            <a
                href="sliders/new"
                className="py-3 px-6 text-lg font-bold text-white bg-primary-800 rounded-xl hover:bg-primary-700 transition-all flex items-center space-x-2"
            >
                <Plus />
                <span>Créer un nouveau Slider</span>
            </a>
        </div>

        {/* Liste des sliders */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          {isLoading && <Loader2 className="mx-auto w-8 h-8 text-primary-800 animate-spin" />}
          {isError && <p className="text-red-500">Erreur de chargement des sliders.</p>}
          
          {!isLoading && !isError && (
            <ul className="space-y-4">
              {sliders?.map((slider) => (
                <li key={slider.id} className="flex items-center justify-between p-6 bg-primary-50 rounded-2xl">
                  {/* Titre et statut */}
                  <div className="flex items-center space-x-4">
                    {slider.isActive ? (
                        <CheckCircle size={24} className="text-green-500 flex-shrink-0" aria-label="Slider Actif" />
                    ) : (
                        <Power size={24} className="text-gray-400 flex-shrink-0" aria-label="Slider Inactif" />
                    )}
                    <div>
                        <span className="text-xl font-medium text-gray-800">{slider.title}</span>
                        <span className="block text-sm text-gray-500">
                            {slider.images.length} {slider.images.length <= 1 ? "image" : "images"}
                        </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-x-2 flex items-center">
                     {/* Bouton Gérer Images */}
                     <button
                        onClick={() => openImageManager(slider)}
                        disabled={isActionLoading}
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition disabled:opacity-50"
                        title="Gérer les images"
                     >
                       <Image size={18} /> Gérer Images
                     </button>
                    {/* Bouton Activer */}
                    <button
                      onClick={() => handleActivate(slider)}
                      disabled={slider.isActive || isActionLoading}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Activer ce slider"
                    >
                      {slider.isActive ? "Actif" : "Activer"}
                    </button>
                    {/* Bouton Renommer */}
                    <button
                      onClick={() => openRenameModal(slider)}
                      disabled={isActionLoading}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition disabled:opacity-50 p-2 hover:bg-blue-100 rounded-lg"
                      title="Renommer"
                    >
                      <Edit size={18} />
                    </button>
                    {/* Bouton Supprimer */}
                    <button
                      onClick={() => openDeleteModal(slider)}
                      disabled={isActionLoading || slider.isActive} // Empêcher la suppression si actif
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition disabled:opacity-50 p-2 hover:bg-red-100 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* MODALES */}

      
      {/* Modale de Renommage (Assumé d'être dans ui/) */}
      <RenameCategoryModal
        open={isRenameModalOpen}
        onClose={closeModal}
        onConfirm={handleRenameConfirm}
        currentName={selectedSlider?.title || ""}
        title="Renommer le Slider"
        confirmLabel={isRenaming ? "Renommage..." : "Renommer"}
      />
      
      {/* Modale de Suppression (Assumé d'être dans ui/) */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le slider "${selectedSlider?.title}" ? Les images associées ne seront plus liées à un slider (relation SetNull).`}
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
      />

      {/* Modale de Gestion des Images */}
      {selectedSlider && (
        <Modal 
            open={isImageManagerOpen} 
            onClose={closeModal} 
            title={`Images du slider : ${selectedSlider.title}`}
        >
          <SliderImageManager 
            slider={selectedSlider} 
            onClose={closeModal}
          />
        </Modal>
      )}
    </>
  );
}
