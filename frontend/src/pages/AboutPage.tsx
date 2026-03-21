import { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Camera, Heart, Users, ShieldCheck, Sparkles, Award, Loader2 } from 'lucide-react';
import { pagesService, Page } from '../services/pages';

const IconMap: any = {
    Camera, Heart, Users, ShieldCheck, Sparkles, Award
};

function DynamicIcon({ name, className, size }: { name: string, className?: string, size?: number }) {
    const Icon = IconMap[name] || Camera;
    return <Icon className={className} size={size} />;
}

export function AboutPage() {
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pagesService.getBySlug('about')
            .then(setPage)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );

    const content = page?.content || {};

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gray-950 text-white">
                <div className="absolute inset-0 grayscale opacity-20 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950 to-gray-950" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <SectionHeader
                        title={content.hero?.title || "Notre Héritage, Votre Histoire"}
                        subtitle={content.hero?.subtitle || "Depuis 1988, nous transformons vos moments précieux en œuvres d'art intemporelles."}
                        badge={content.hero?.badge || "L Benna Production • 40 Ans d'Excellence"}
                        icon={Heart}
                        dark
                    />
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-gray-950 tracking-tighter">
                            {content.story?.title || "Plus qu'un studio, une passion familiale."}
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            {content.story?.text1 || (
                                <>Fondé en 1988, <strong>L Benna Production</strong> est né d'une volonté simple : capturer l'essence de l'émotion humaine à travers l'objectif. Ce qui a commencé comme un petit studio de quartier s'est transformé en une référence nationale dans la production audiovisuelle.</>
                            )}
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            {content.story?.text2 || "Aujourd'hui, nous allions tradition et technologie de pointe. Avec un parc matériel de dernière génération (capteurs 100MP, drones 5.4K) et une équipe de passionnés, nous continuons de sublimer vos mariages, vos événements d'entreprise et vos portraits de famille."}
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 pt-8">
                            {(content.story?.highlights || [
                                { title: "Expertise Reconnue", text: "Plus de 2000 mariages couverts et des centaines de films corporate.", icon_name: "Award" },
                                { title: "Innovation", text: "Toujours à l'avant-garde des techniques de prise de vue et de montage.", icon_name: "Sparkles" }
                            ]).map((hl: any, idx: number) => (
                                <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 italic">
                                    <DynamicIcon name={hl.icon_name} className="text-primary-600 mb-4" size={32} />
                                    <h4 className="font-bold text-gray-900 mb-2">{hl.title}</h4>
                                    <p className="text-sm text-gray-500">{hl.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e" className="w-full h-full object-cover" alt="Studio L Benna" />
                        </div>
                        <div className="absolute inset-0 bg-primary-600/10 rounded-[3rem] -rotate-6 scale-105" />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tighter">Nos Engagements</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {(content.values || [
                            { title: "Équipe Dédiée", text: "Chaque projet est unique. Notre équipe s'immerge dans votre univers pour un résultat qui vous ressemble.", icon_name: "Users" },
                            { title: "Qualité Sans Compromis", text: "De la prise de vue au rendu final, nous ne faisons aucune concession sur la qualité technique et artistique.", icon_name: "ShieldCheck" },
                            { title: "Matériel de Pointe", text: "Nous investissons constamment dans le meilleur matériel pour garantir des images d'une netteté exceptionnelle.", icon_name: "Camera" }
                        ]).map((val: any, idx: number) => (
                            <ValueItem key={idx} icon={<DynamicIcon name={val.icon_name} size={40} />} title={val.title} text={val.text} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueItem({ icon, title, text }: any) {
    return (
        <div className="space-y-6">
            <div className="w-20 h-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mx-auto text-primary-600">
                {icon}
            </div>
            <h4 className="text-xl font-black text-gray-900">{title}</h4>
            <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
        </div>
    );
}
