
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { settingsService, type AppSettings } from '@/services/settings';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const s = await settingsService.getAll();
      if (mounted) setSettings(s);
    })();
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await settingsService.update(settings);
      setSettings(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Paramètres</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les paramètres de votre application
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Paiement & Facturation
            </h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="paymentEnabled"
                    name="paymentEnabled"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={!!settings?.paymentEnabled}
                    onChange={(e) => setSettings((s: AppSettings | null) => s ? { ...s, paymentEnabled: e.target.checked } as AppSettings : s)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="paymentEnabled" className="font-medium text-gray-700">
                    Activer le paiement en ligne
                  </label>
                  <p className="text-gray-500">
                    Permet aux clients de payer leurs devis et réservations en ligne.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  disabled={!settings || saving}
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Automatisation Marketing
            </h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingEnabled"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={!!settings?.marketing_anniversary_automation_enabled}
                    onChange={(e) => setSettings((s: any) => s ? { ...s, marketing_anniversary_automation_enabled: e.target.checked } : s)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEnabled" className="font-medium text-gray-700">
                    Activer les Coupons d'Anniversaire
                  </label>
                  <p className="text-gray-500">
                    Envoie automatiquement un code promo aux clients lors de l'anniversaire de leur premier projet.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valeur du coupon (%)
                  </label>
                  <input
                    type="number"
                    value={settings?.marketing_anniversary_coupon_value ?? 15}
                    onChange={(e) => setSettings((s: any) => s ? { ...s, marketing_anniversary_coupon_value: Number(e.target.value) } : s)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Durée de validité (jours)
                  </label>
                  <input
                    type="number"
                    value={settings?.marketing_anniversary_coupon_validity_days ?? 30}
                    onChange={(e) => setSettings((s: any) => s ? { ...s, marketing_anniversary_coupon_validity_days: Number(e.target.value) } : s)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Coordonnées de Contact
            </h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  value={settings?.contact_phone ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, contact_phone: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Email de contact</label>
                <input
                  type="email"
                  value={settings?.contact_email ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, contact_email: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Adresse Physique</label>
                <input
                  type="text"
                  value={settings?.contact_address ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, contact_address: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium leading-6 text-gray-900 mt-10">
              Réseaux Sociaux
            </h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="text"
                  value={settings?.social_facebook ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, social_facebook: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="text"
                  value={settings?.social_instagram ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, social_instagram: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube</label>
                <input
                  type="text"
                  value={settings?.social_youtube ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, social_youtube: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="text"
                  value={settings?.social_linkedin ?? ''}
                  onChange={(e) => setSettings((s: any) => s ? { ...s, social_linkedin: e.target.value } : s)}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                disabled={!settings || saving}
                onClick={handleSave}
                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer les paramètres de contact'}
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Configuration API
            </h3>
            <div className="mt-6 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="api_key"
                  className="block text-sm font-medium text-gray-700"
                >
                  Clé API
                </label>
                <input
                  type="text"
                  name="api_key"
                  id="api_key"
                  disabled
                  value="sk_test_123456789"
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Régénérer la clé API
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Sauvegardes</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Dernière sauvegarde: 12 mars 2024 à 03:00</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Lancer une sauvegarde manuelle
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}