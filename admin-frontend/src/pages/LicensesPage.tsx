import { Card } from '@/components/ui/Card';

export function LicensesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Licences</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left">Clé</th>
                <th className="py-3 px-4 text-left">Utilisateur</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Date d'expiration</th>
                <th className="py-3 px-4 text-left">Statut</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Liste des licences à implémenter */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}