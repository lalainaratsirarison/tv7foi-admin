"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from 'react-hot-toast'; 
import { 
  useGetBlogCategories, 
  useGetBlog as useGetBlogById, // Renommé pour correspondre au composant précédent
  useUpdateBlog,
  // Assurez-vous d'importer le type pour la mise à jour si nécessaire, ou utilisez 'any' pour l'exemple
} from "@/services/blogs"; 
import dynamic from "next/dynamic";


const RichTextEditor = dynamic(
    () => import("@/components/ui/RichTextEditor").then(mod => mod.RichTextEditorComponent),
    { 
        ssr: false, 
        loading: () => (
            <div className="min-h-[300px] p-4 text-lg border-2 border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50">
                <span className="text-gray-600">Préparation de l'éditeur...</span>
            </div>
        )
    }
);


export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const blogId = id;
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState(""); 
  const [categoryId, setCategoryId] = useState(""); 

  // 1. Récupération des données du blog existant
  const { 
    data: blogData, 
    isLoading: isLoadingBlog, 
    isError: isErrorBlog 
  } = useGetBlogById(blogId); // Utilise le hook useGetBlog (renommé)

  // 2. Récupération des catégories
  const { data: categories, isLoading: isLoadingCategories } = useGetBlogCategories();
  
  // 3. Hook de mutation pour la mise à jour. 
  // ⚠️ Important : Le hook useUpdateBlog dans votre service prend l'ID en paramètre.
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();

  // Remplir le formulaire lorsque les données du blog sont chargées
  useEffect(() => {
    // 🟢 Cette logique est cruciale : elle hydrate le formulaire avec les données existantes.
    if (blogData) {
        setTitle(blogData.title || "");
        setAuthor(blogData.author || "");
        setContent(blogData.content || "");
        // Assurez-vous que categoryId est une string (peut être null dans la BDD)
        setCategoryId(blogData.categoryId || ""); 
    }
  }, [blogData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isContentEmpty = !content || content.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (!title.trim() || isContentEmpty || !categoryId || !author.trim()) {
      toast.error("Veuillez remplir le titre, l'auteur, le contenu et sélectionner une catégorie.");
      return;
    }

    updateBlog({id: blogId, data: {title, author, categoryId, content}});
    
  };
  
  if (isLoadingBlog || isLoadingCategories) {
      return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-4xl font-bold text-gray-900">Modification de l'Article (ID: {blogId})</h1>
            <div className="bg-white p-12 rounded-3xl shadow-lg flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-500 mr-3" size={32} />
                <p className="text-xl text-gray-600">Chargement des données de l'article...</p>
            </div>
        </div>
      );
  }

  if (isErrorBlog) {
      return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-4xl font-bold text-red-700">Erreur de Chargement</h1>
            <div className="bg-white p-12 rounded-3xl shadow-lg">
                <p className="text-lg text-gray-600">
                    Impossible de charger l'article avec l'ID: **{blogId}**. Il se peut que l'article n'existe pas ou qu'une erreur serveur se soit produite.
                </p>
                <Link href="/blogs" className="mt-4 inline-block text-primary-800 hover:text-primary-600 transition">
                    &larr; Retour à la liste des articles
                </Link>
            </div>
        </div>
      );
  }
  
  if (!blogData) {
      // Cas où isLoadingBlog est false et blogData est null/undefined (article non trouvé)
      return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-4xl font-bold text-red-700">Article Introuvable</h1>
            <div className="bg-white p-12 rounded-3xl shadow-lg">
                <p className="text-lg text-gray-600">
                    L'article que vous essayez de modifier (ID: **{blogId}**) n'a pas été trouvé.
                </p>
                <Link href="/blogs" className="mt-4 inline-block text-primary-800 hover:text-primary-600 transition">
                    &larr; Retour à la liste des articles
                </Link>
            </div>
        </div>
      );
  }


  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      <div className="flex items-center space-x-4">
        <Link href="/blogs" className="p-3 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">
            Modification de l'Article
        </h1>
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
            disabled={isUpdating}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="Titre impactant de l'article"
          />
        </div>
        
        {/* Champ Auteur */}
        <div>
          <label htmlFor="author" className="block text-lg font-medium text-gray-700 mb-2">Auteur</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isUpdating}
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
            disabled={isUpdating || isLoadingCategories}
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
          <RichTextEditor
            // L'initialisation du contenu est gérée par l'état 'content' qui est mis à jour dans l'useEffect
            content={content}
            onChange={setContent}
            disabled={isUpdating}
            placeholder="Écrivez le corps de votre article ici..."
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isUpdating}
            className="cursor-pointer py-5 px-10 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <Save size={24} />
            <span>{isUpdating ? "Mise à jour..." : "Mettre à jour l'article"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}