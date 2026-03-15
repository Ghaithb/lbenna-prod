import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const installedHandler = () => setIsInstalled(true);
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {installPrompt && !isInstalled && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={async () => {
              try {
                await installPrompt.prompt();
                const choice = await installPrompt.userChoice;
                if (choice?.outcome !== 'accepted') setInstallPrompt(null);
              } catch {
                setInstallPrompt(null);
              }
            }}
            className="px-4 py-2 rounded-full bg-gradient-fire text-white shadow-lg"
          >
            Installer l’app
          </button>
        </div>
      )}
    </div>
  );
}
