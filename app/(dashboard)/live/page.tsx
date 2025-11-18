"use client";

import { useState } from "react";
import { useGetFlvList, useDeleteFlv, downloadFlvFile } from "@/services/flv";
import { Loader2, FileVideo, Download, Trash2, AlertCircle, HardDrive } from "lucide-react";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import toast from "react-hot-toast";

export default function FlvPage() {
  // --- Hooks ---
  const { data: files, isLoading, isError } = useGetFlvList();
  const { mutate: deleteFlv, isPending: isDeleting } = useDeleteFlv();

  // --- États ---
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null); // Stocke le nom du fichier en cours de DL

  // --- Actions ---

  const handleDownload = async (filename: string) => {
    setIsDownloading(filename);
    try {
      await downloadFlvFile(filename);
      toast.success("Téléchargement lancé !");
    } catch (error) {
      toast.error("Erreur lors du téléchargement.");
    } finally {
      setIsDownloading(null);
    }
  };

  const openDeleteModal = (filename: string) => {
    setFileToDelete(filename);
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    deleteFlv(fileToDelete, {
      onSuccess: () => {
        toast.success(`Fichier "${fileToDelete}" supprimé.`);
        setFileToDelete(null);
      },
      onError: () => {
        toast.error("Impossible de supprimer le fichier.");
        setFileToDelete(null);
      }
    });
  };

  return (
    <>
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Gestion des Fichiers FLV</h1>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <HardDrive size={18} className="mr-2" />
            Dossier : /public/flv
          </div>
        </div>

        {/* Liste des fichiers */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary-800 animate-spin" />
            </div>
          )}

          {isError && (
            <div className="text-center py-10 text-red-500 flex flex-col items-center">
              <AlertCircle size={40} className="mb-2" />
              <p>Impossible de charger la liste des fichiers.</p>
            </div>
          )}

          {!isLoading && !isError && files?.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileVideo size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Aucun fichier .flv trouvé dans le dossier.</p>
            </div>
          )}

          {!isLoading && files && files.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du fichier</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((filename) => (
                    <tr key={filename} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                            <FileVideo size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{filename}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleDownload(filename)}
                            disabled={isDownloading === filename}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition disabled:opacity-50"
                            title="Télécharger"
                          >
                            {isDownloading === filename ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Download size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => openDeleteModal(filename)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modale de suppression */}
      <ConfirmDeleteModal
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le fichier"
        description={`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${fileToDelete}" du serveur ?`}
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
      />
    </>
  );
}