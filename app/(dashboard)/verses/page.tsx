export default function VersesPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">Gestion des Versets</h1>
      <div className="bg-white p-12 rounded-3xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Liste des versets planifiés</h2>
        <p className="text-gray-500 mt-4">
          @TODO: Implémenter <code className="bg-gray-100 p-1 rounded">useGetVerses</code> et afficher la liste des versets.
          <br/>
          Ajouter un formulaire (probablement dans une modale) pour créer/modifier un verset (texte, référence, date planifiée, statut).
        </p>
      </div>
    </div>
  );
}
