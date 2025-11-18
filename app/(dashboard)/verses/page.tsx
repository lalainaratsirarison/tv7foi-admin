"use client";

import { useState } from "react";
import { 
  useGetVerses, 
  useCreateVerse, 
  useUpdateVerse, 
  useDeleteVerse, 
  Verse,
  CreateVerseData 
} from "@/services/verses";
import { Loader2, Plus, Edit, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import VerseModal from "@/components/ui/VerseModal";
import toast from "react-hot-toast";

export default function VersesPage() {
  // --- Hooks ---
  const { data: verses, isLoading, isError } = useGetVerses();
  const { mutate: createVerse, isPending: isCreating } = useCreateVerse();
  const { mutate: updateVerse, isPending: isUpdating } = useUpdateVerse();
  const { mutate: deleteVerse, isPending: isDeleting } = useDeleteVerse();

  // --- États ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  // --- Actions ---

  // Ouverture Modale Création
  const handleOpenCreate = () => {
    setSelectedVerse(null);
    setIsModalOpen(true);
  };

  // Ouverture Modale Edition
  const handleOpenEdit = (verse: Verse) => {
    setSelectedVerse(verse);
    setIsModalOpen(true);
  };

  // Soumission du formulaire (Create ou Update)
  const handleFormSubmit = (data: CreateVerseData) => {
    if (selectedVerse) {
      // Mode Update
      updateVerse({ id: selectedVerse.id, data }, {
        onSuccess: () => {
          toast.success("Verset mis à jour !");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
            // Gérer l'erreur de date unique (P2002)
            if (err.response?.status === 409) {
                toast.error("Un verset est déjà planifié pour cette date.");
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        }
      });
    } else {
      // Mode Create
      createVerse(data, {
        onSuccess: () => {
          toast.success("Verset planifié avec succès !");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
             if (err.response?.status === 409) {
                toast.error("Un verset est déjà planifié pour cette date.");
            } else {
                toast.error("Erreur lors de la création.");
            }
        }
      });
    }
  };

  // Suppression
  const openDeleteModal = (verse: Verse) => {
    setSelectedVerse(verse);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedVerse) return;
    deleteVerse(selectedVerse.id, {
      onSuccess: () => {
        toast.success("Verset supprimé.");
        setIsDeleteModalOpen(false);
        setSelectedVerse(null);
      },
      onError: () => {
        toast.error("Erreur lors de la suppression.");
      }
    });
  };

  // Trier les versets par date planifiée (du plus récent au plus ancien ou inversement)
  const sortedVerses = verses?.sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

  return (
    <>
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Gestion des Versets</h1>
          <button
            onClick={handleOpenCreate}
            className="py-3 px-6 text-lg font-bold text-white bg-primary-800 rounded-xl hover:bg-primary-700 transition-all flex items-center space-x-2"
          >
            <Plus size={24} />
            <span>Planifier un verset</span>
          </button>
        </div>

        {/* Liste */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          {isLoading && <Loader2 className="mx-auto w-8 h-8 text-primary-800 animate-spin" />}
          {isError && <p className="text-red-500">Erreur de chargement des données.</p>}

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texte</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedVerses?.map((verse) => (
                            <tr key={verse.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900 font-medium">
                                        <Calendar size={16} className="mr-2 text-primary-600" />
                                        {new Date(verse.scheduledDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700">
                                    {verse.reference}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {verse.text}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {verse.published ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle size={12} className="mr-1" /> Publié
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <XCircle size={12} className="mr-1" /> Brouillon
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleOpenEdit(verse)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => openDeleteModal(verse)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedVerses?.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucun verset planifié pour le moment.</p>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Modale Création / Edition */}
      <VerseModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
        verseToEdit={selectedVerse}
      />

      {/* Modale Suppression */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le verset"
        description={`Êtes-vous sûr de vouloir supprimer le verset "${selectedVerse?.reference}" prévu pour le ${new Date(selectedVerse?.scheduledDate || '').toLocaleDateString()} ?`}
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
      />
    </>
  );
}