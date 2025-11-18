"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useUploadImage } from "@/services/images";
import { Loader2, Plus, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewImagePage() {
  const router = useRouter();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      const defaultName = selected.name.split('.').slice(0, -1).join('.');
      if (!title) setTitle(defaultName);
      if (!alt) setAlt(defaultName);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAlt("");
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier image.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('alt', alt);

    uploadImage(formData, {
      onSuccess: () => {
        toast.success("Image uploadée avec succès !");
        resetForm();
        router.push('/images');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || "Échec de l'upload.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ajouter une nouvelle image</h1>
        <Link href="/images" className="text-sm text-gray-600 underline">Retour à la médiathèque</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-1">
          <label className="block text-lg font-medium text-gray-700 mb-2">Fichier Image</label>
          <div 
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-500 relative cursor-pointer hover:border-primary-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Aperçu" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center">
                <UploadCloud size={48} className="mx-auto" />
                <p>Cliquez pour choisir un fichier</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          {file && (
            <button type="button" onClick={resetForm} disabled={isUploading} className="mt-2 text-sm text-red-600 hover:text-red-800">Annuler</button>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor="imageTitle" className="block text-lg font-medium text-gray-700 mb-2">Titre de l'image (optionnel)</label>
            <input
              type="text"
              id="imageTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="w-full py-4 px-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
              placeholder="Ex: Coucher de soleil plage"
            />
          </div>

          <div>
            <label htmlFor="imageAlt" className="block text-lg font-medium text-gray-700 mb-2">Texte alternatif (Alt)</label>
            <input
              type="text"
              id="imageAlt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              disabled={isUploading}
              className="w-full py-4 px-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
              placeholder="Ex: Un coucher de soleil sur l'océan"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full py-5 px-8 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Plus />}
            <span>{isUploading ? "Upload en cours..." : "Ajouter à la médiathèque"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
