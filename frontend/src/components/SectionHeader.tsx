import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    icon?: LucideIcon;
    centered?: boolean;
    dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    badge,
    icon: Icon,
    centered = true,
    dark = false
}) => {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} animate-fade-in-up`}>
            {badge && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${dark ? 'bg-white/10 text-white border border-white/20' : 'bg-purple-50 text-purple-600'
                    }`}>
                    {Icon && <Icon size={12} />}
                    {badge}
                </div>
            )}
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-950'
                }`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`text-lg max-w-2xl leading-relaxed font-medium ${dark ? 'text-gray-400' : 'text-gray-500'
                    } ${centered ? 'mx-auto' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};
