import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            {icon}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                </div>
                {subtitle && (
                    <p className="mt-1 text-sm text-gray-500 ml-1">{subtitle}</p>
                )}
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}
