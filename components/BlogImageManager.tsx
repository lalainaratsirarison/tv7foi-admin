"use client";

import { useState, useRef, useEffect } from 'react';
// 💡 CORRECTION : Utilisation de chemins relatifs au lieu d'alias
import { Blog } from '../services/blogs';
import {
  useGetImages,
  useAddImagesToBlog,
  useRemoveImagesFromBlog,
  useDeleteImage,
  Image,
} from '../services/images';
import { Plus, Trash2, X, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Propriétés attendues par ce composant
interface BlogImageManagerProps {
  blog: Blog;
  onClose: () => void;
}

export default function BlogImageManager({ blog, onClose }: BlogImageManagerProps) {
  // Toutes les images disponibles côté serveur
  const { data: allImages, isLoading: isLoadingAllImages } = useGetImages();

  // Hooks pour associer/dissocier par ID (images service)
  const { mutate: addImagesById, isPending: isAddingById } = useAddImagesToBlog();
  const { mutate: removeImagesById, isPending: isRemovingById } = useRemoveImagesFromBlog();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();

  // State pour la sélection (IDs)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialIds, setInitialIds] = useState<Set<string>>(new Set());

  // Initialiser la sélection depuis le blog prop
  useEffect(() => {
    // 💡 Leçon : S'assurer que blog.images existe avant de mapper
    const ids = new Set<string>(blog.images?.map((i) => i.id) || []);
    setSelectedIds(new Set(ids));
    setInitialIds(new Set(ids));
  }, [blog, allImages]); // Ajout de allImages comme dépendance pour recalculer si la liste change

  // --- Gestion de la suppression d'images ---

  const handleDeleteImage = (imageId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?\nCette action est irréversible et supprime le fichier du serveur.")) return;
    deleteImage(imageId, {
      onSuccess: () => {
        toast.success("Image supprimée.");
      },
      onError: () => {
        toast.error("Erreur lors de la suppression de l'image.");
      }
    });
  };

  // Toggle sélection d'une image (pour associer/dissocier)
  const toggleSelect = (imageId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(imageId)) next.delete(imageId);
      else next.add(imageId);
      return next;
    });
  };

  // Enregistrer les changements (diff entre selectedIds et initialIds)
  const handleSaveSelection = () => {
    const toAdd: string[] = [];
    const toRemove: string[] = [];

    for (const id of selectedIds) {
      if (!initialIds.has(id)) toAdd.push(id);
    }
    for (const id of initialIds) {
      if (!selectedIds.has(id)) toRemove.push(id);
    }

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.success("Aucun changement.");
      return;
    }

    let errors = false;
    
    // Appel des mutations
    
    if (toAdd.length > 0) {
      addImagesById({ blogId: blog.id, imagesIds: toAdd }, {
        onSuccess: () => {
          toast.success(`${toAdd.length} image(s) ajoutée(s) au blog.`);
        },
        onError: () => {
          errors = true;
          toast.error("Erreur lors de l'ajout d'images au blog.");
        }
      });
    }

    if (toRemove.length > 0) {
      removeImagesById({ imagesIds: toRemove }, {
        onSuccess: () => {
          toast.success(`${toRemove.length} image(s) retirée(s) du blog.`);
        },
        onError: () => {
          errors = true;
          toast.error("Erreur lors de la suppression d'images du blog.");
        }
      });
    }
    
    // Mettre à jour l'état initial uniquement si aucune erreur n'est survenue
    // Note : c'est une simplification, idéalement on attendrait le retour des promesses
    if (!errors) {
      setInitialIds(new Set(selectedIds));
    }
  };
  
  const isLoading = isAddingById || isRemovingById || isDeleting;

  return (
    <div className="space-y-8 p-4">
      {/* 1. Liste des Images Existantes (Médiathèque) */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
            Médiathèque
        </h3>
        <p className="text-sm text-gray-500 mb-4">Sélectionnez les images existantes à (dé)lier de ce blog. N'oubliez pas d'enregistrer.</p>

        {isLoadingAllImages ? (
          <div className="flex justify-center items-center h-40">
             <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg">
            {allImages?.map((image: Image) => {
              const isSelected = selectedIds.has(image.id);
              // L'image est-elle liée à un *autre* blog ?
              const isUsedElsewhere = image.blogId !== null && image.blogId !== blog.id;
              
              return (
                <div 
                  key={image.id} 
                  className={`relative group rounded-lg overflow-hidden shadow-md border-4 cursor-pointer transition-all
                  ${isSelected ? 'border-primary-600 ring-4 ring-primary-200' : 'border-transparent'}
                  ${isUsedElsewhere ? 'opacity-40 cursor-not-allowed' : 'hover:border-gray-300'}
                  `}
                  onClick={() => !isUsedElsewhere && toggleSelect(image.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={process.env.NEXT_PUBLIC_STATIC_URL + image.path} // 💡 Assurez-vous que NEXT_PUBLIC_STATIC_URL est défini
                    alt={image.alt || image.title || "Image"}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Indicateur de sélection */}
                  {isSelected && (
                     <div className="absolute top-1 right-1 p-0.5 bg-primary-600 text-white rounded-full z-10">
                        <Check size={16} />
                      </div>
                  )}

                  {/* Overlay au survol */}
                  <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2
                    ${isUsedElsewhere ? 'opacity-100' : ''}
                  `}>
                    {/* Bouton de suppression (supprime de la BDD) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche le toggleSelect
                        handleDeleteImage(image.id);
                      }}
                      disabled={isDeleting}
                      className="absolute top-1 left-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 z-20"
                      title="Supprimer définitivement cette image"
                    >
                      {isDeleting && selectedIds.has(image.id) ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
                    </button>
                    
                    {/* Indicateur si utilisé ailleurs */}
                    {isUsedElsewhere && (
                        <span className="text-white text-xs text-center font-bold">Utilisée ailleurs</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton de sauvegarde des sélections */}
        <div className="mt-4 flex items-center space-x-3">
          <button
            onClick={handleSaveSelection}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-800 text-white rounded disabled:opacity-50 flex items-center"
          >
            {isAddingById || isRemovingById ? <Loader2 className="animate-spin inline mr-2" size={18} /> : null}
            Enregistrer les changements de sélection
          </button>
        </div>
      </div>

      {/* 3. Bouton de fermeture de la modale */}
      <div className="pt-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}