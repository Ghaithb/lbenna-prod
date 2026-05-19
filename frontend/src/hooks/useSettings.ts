import { useState, useEffect } from 'react';
import { settingsService, PublicSettings } from '../services/settings';

let cache: PublicSettings | null = null;
let cacheAt = 0;
const CACHE_TTL_MS = 60_000;

export function invalidateSettingsCache() {
    cache = null;
    cacheAt = 0;
}

export function useSettings() {
    const [settings, setSettings] = useState<PublicSettings | null>(cache);
    const [loading, setLoading] = useState(!cache);

    useEffect(() => {
        const fresh = cache && Date.now() - cacheAt < CACHE_TTL_MS;
        if (fresh) {
            setSettings(cache);
            setLoading(false);
            return;
        }
        settingsService.getPublic().then(data => {
            cache = data;
            cacheAt = Date.now();
            setSettings(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return { settings, loading, refetch: () => {
        invalidateSettingsCache();
        return settingsService.getPublic().then(data => {
            cache = data;
            cacheAt = Date.now();
            setSettings(data);
            return data;
        });
    }};
}
