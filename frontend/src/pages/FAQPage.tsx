import { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { HelpCircle, ChevronRight, Loader2 } from 'lucide-react';
import { faqsService, Faq } from '../services/faqs';

export function FAQPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        faqsService.getAll().then(data => {
            setFaqs(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-32 pb-20 overflow-hidden bg-gray-950 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-950 to-gray-950" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <SectionHeader
                        title="Questions Fréquentes"
                        subtitle="Tout ce que vous devez savoir pour préparer votre projet sereinement."
                        badge="Centre d'aide"
                        icon={HelpCircle}
                        dark
                    />
                </div>
            </section>

            <section className="py-24 max-w-3xl mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-primary-600" size={40} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={faq.id || idx} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all group">
                                <div className="flex gap-6">
                                    <div className="hidden sm:flex w-12 h-12 bg-white rounded-2xl items-center justify-center text-primary-600 shadow-sm shrink-0 font-black italic">
                                        ?
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-950 mb-4 tracking-tight group-hover:text-primary-600 transition-colors">{faq.question}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed font-outfit">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20 p-12 bg-gray-950 rounded-[3rem] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl" />
                    <h3 className="text-2xl font-black mb-4">Encore des questions ?</h3>
                    <p className="text-gray-400 mb-8 font-medium">Notre équipe est à votre disposition pour vous répondre en direct.</p>
                    <a href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-950 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">
                        Nous contacter <ChevronRight size={18} />
                    </a>
                </div>
            </section>
        </div>
    );
}
