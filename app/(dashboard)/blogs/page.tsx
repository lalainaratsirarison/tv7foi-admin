import Link from "next/link";
import { Plus } from "lucide-react";

export default function BlogsPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Blogs</h1>
        <Link
          href="/blogs/new"
          className="py-4 px-6 text-lg font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={24} />
          <span>Écrire un article</span>
        </Link>
      </div>
      <div className="bg-white p-12 rounded-3xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Liste des blogs</h2>
        <p className="text-gray-500 mt-4">
          @TODO: Implémenter <code className="bg-gray-100 p-1 rounded">useGetBlogs</code> et afficher la liste des articles ici (similaire à la page Vidéos).
        </p>
      </div>
    </div>
  );
}
