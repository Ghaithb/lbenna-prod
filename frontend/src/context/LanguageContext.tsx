import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'FR' | 'EN' | 'AR';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
    FR: {
        'nav.tutorials': 'Tutoriels',
        'nav.workshops': 'Ateliers',
        'tutorials.title': 'Tutoriels',
        'tutorials.subtitle': 'Apprenez la photographie avec nos cours',
        'common.loading': 'Chargement...',
        'common.error': 'Une erreur est survenue',
        'filter.category': 'Catégorie',
        'filter.level': 'Niveau',
        'level.BEGINNER': 'Débutant',
        'level.INTERMEDIATE': 'Intermédiaire',
        'level.ADVANCED': 'Avancé',
    },
    EN: {
        'nav.tutorials': 'Tutorials',
        'nav.workshops': 'Workshops',
        'tutorials.title': 'Tutorials',
        'tutorials.subtitle': 'Learn photography with our courses',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'filter.category': 'Category',
        'filter.level': 'Level',
        'level.BEGINNER': 'Beginner',
        'level.INTERMEDIATE': 'Intermediate',
        'level.ADVANCED': 'Advanced',
    },
    AR: {
        'nav.tutorials': 'دروس',
        'nav.workshops': 'ورش العمل',
        'tutorials.title': 'دروس',
        'tutorials.subtitle': 'تعلم التصوير الفوتوغرافي مع دوراتنا',
        'common.loading': 'جار التحميل...',
        'common.error': 'حدث خطأ',
        'filter.category': 'فئة',
        'filter.level': 'مستوى',
        'level.BEGINNER': 'مبتدئ',
        'level.INTERMEDIATE': 'متوسط',
        'level.ADVANCED': 'متقدم',
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'FR';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
        document.documentElement.lang = language.toLowerCase();
    }, [language]);

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
