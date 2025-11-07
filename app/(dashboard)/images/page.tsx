export default function ImagesPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">Galerie d'Images</h1>
      <div className="bg-white p-12 rounded-3xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Galerie</h2>
        <p className="text-gray-500 mt-4">
          @TODO: Implémenter <code className="bg-gray-100 p-1 rounded">useGetImages</code> et afficher une galerie d'images.
          <br/>
          Ajouter un bouton d'upload (probablement avec <code className="bg-gray-100 p-1 rounded">useCreateImage</code>) pour ajouter de nouvelles images.
        </p>
      </div>
    </div>
  );
}
