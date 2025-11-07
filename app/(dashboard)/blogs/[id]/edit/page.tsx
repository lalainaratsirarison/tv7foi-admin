export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">Modifier l'Article (ID: {params.id})</h1>
      <div className="bg-white p-12 rounded-3xl shadow-lg">
        <p className="text-lg text-gray-600">
          @TODO: Implémenter le formulaire de modification de blog, pré-rempli avec les données de l'article.
        </p>
      </div>
    </div>
  );
}
