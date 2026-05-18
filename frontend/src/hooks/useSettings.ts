import { useState, useEffect } from 'react';
import { settingsService, PublicSettings } from '../services/settings';

let cache: PublicSettings | null = null;

export function useSettings() {
    const [settings, setSettings] = useState<PublicSettings | null>(cache);
    const [loading, setLoading] = useState(!cache);

    useEffect(() => {
        if (cache) { setSettings(cache); setLoading(false); return; }
        settingsService.getPublic().then(data => {
            cache = data;
            setSettings(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return { settings, loading };
}
