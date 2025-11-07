"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from 'react-hot-toast'; 
import { useCreateBlog, useGetBlogCategories } from "@/services/blogs";
import dynamic from "next/dynamic";


const RichTextEditor = dynamic(
    () => import("@/components/ui/RichTextEditor").then(mod => mod.RichTextEditorComponent),
    { 
        ssr: false, 
        // Affiche un état de chargement simple en attendant l'hydratation côté client
        loading: () => (
            <div className="min-h-[300px] p-4 text-lg border-2 border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50">
                <span className="text-gray-600">Préparation de l'éditeur...</span>
            </div>
        )
    }
);


export default function NewBlogPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [categoryId, setCategoryId] = useState(""); 
  // 🟢 AJOUT DE L'ÉTAT POUR L'AUTEUR
  const [author, setAuthor] = useState(""); 
  
  const { data: categories, isLoading: isLoadingCategories } = useGetBlogCategories();
  const { mutate: createBlog, isPending: isSaving } = useCreateBlog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isContentEmpty = !content || content.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    // 🟢 MISE À JOUR DE LA VALIDATION POUR INCLURE L'AUTEUR
    if (!title.trim() || isContentEmpty || !categoryId || !author.trim()) {
      toast.error("Veuillez remplir le titre, l'auteur, le contenu et sélectionner une catégorie.");
      return;
    }

    const newBlogData = {
      title,
      content, 
      categoryId,
      // 🟢 AJOUT DE L'AUTEUR DANS LES DONNÉES
      author: author.trim(),
    };
    
    createBlog(newBlogData, {
      onSuccess: () => {
        toast.success("Article créé avec succès !");
        router.push("/blogs");
      },
      onError: (error) => {
        console.error("Échec de la création de l'article:", error);
        toast.error("Échec de la création. Vérifiez les logs du serveur.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      <div className="flex items-center space-x-4">
        <Link href="/blogs" className="p-3 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Nouvel Article de Blog</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 lg:p-12 rounded-3xl shadow-lg space-y-8"
      >
        {/* Champ Titre */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Titre de l'article</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Titre impactant de l'article"
          />
        </div>
        
        {/* 🟢 Champ Auteur (NOUVEAU) */}
        <div>
          <label htmlFor="author" className="block text-lg font-medium text-gray-700 mb-2">Auteur</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isSaving}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Nom de l'auteur"
          />
        </div>


        {/* Champ Catégorie */}
        <div>
          <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSaving || isLoadingCategories}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition bg-white"
          >
            <option value="">
              {isLoadingCategories ? "Chargement des catégories..." : "Sélectionner une catégorie"}
            </option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* CHAMP ÉDITEUR DE TEXTE RICHE */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
            Contenu de l'article
          </label>
          {/* 🟢 UTILISATION DU COMPOSANT DYNAMIQUE */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            disabled={isSaving}
            placeholder="Écrivez le corps de votre article ici..."
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer py-5 px-10 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {/* ... (bouton de sauvegarde) ... */}
            <Save size={24} />
            <span>Enregistrer l'article</span>
          </button>
        </div>
      </form>
    </div>
  );
}