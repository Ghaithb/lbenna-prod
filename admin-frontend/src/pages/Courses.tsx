
import { Card } from '@/components/ui/Card';

export default function Courses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Gestion des cours</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Ajouter un cours
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Example course cards */}
        <Card className="flex flex-col">
          <div className="flex-shrink-0">
            <img
              className="h-48 w-full object-cover"
              src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
              alt="Course thumbnail"
            />
          </div>
          <div className="flex-1 bg-white p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-600">Photography</p>
              <div className="mt-2">
                <p className="text-xl font-semibold text-gray-900">Introduction à la Photographie</p>
                <p className="mt-3 text-base text-gray-500">
                  Apprenez les bases de la photographie avec ce cours complet pour débutants.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Publié
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">12 leçons</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Modifier
                </button>
                <button className="text-sm text-red-500 hover:text-red-700">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Add more course cards here */}
      </div>
    </div>
  );
}