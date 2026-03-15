import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Sparkles, Instagram, Facebook } from 'lucide-react';
import { messagesService } from '../services/messages';

export function ContactPage() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await messagesService.send(data);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de l\'envoi du message.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-50 rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in-95 duration-500 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary-200">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-950 tracking-tight">Message Envoyé !</h2>
            <p className="text-gray-500 font-medium font-outfit">Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.</p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="w-full py-5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-gray-200"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} /> Entrons en contact
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-950 tracking-tighter mb-8 max-w-4xl mx-auto leading-[0.9]">
            Votre vision mérite un <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">regard d'exception.</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto font-outfit">
            Une question sur nos services ? Un projet spécifique en tête ? Nous sommes à votre écoute pour transformer vos idées en images.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-20 pb-32">
          {/* Info Sidebar */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-gray-950 tracking-tight">Nous trouver</h3>
              <div className="space-y-6">
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Studio Lab El Benna</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">123 Avenue de la Liberté, Tunis, Tunisie</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">contact@labelbenna.com</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Téléphone</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">+216 71 000 000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gray-950 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-600/30 transition-all" />
              <h4 className="text-2xl font-black tracking-tight relative z-10">Suivez nos backstages</h4>
              <p className="text-gray-400 font-medium font-outfit relative z-10">Découvrez les coulisses de nos tournages et nos dernières réalisations au quotidien.</p>
              <div className="flex gap-4 relative z-10">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-xl shadow-gray-100">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nom complet</label>
                    <input
                      {...register('name', { required: true })}
                      placeholder="Ahmed Benna"
                      className={`w-full px-6 py-5 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-3xl focus:border-primary-600 focus:ring-0 transition-all font-bold text-gray-950 placeholder:text-gray-300`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email</label>
                    <input
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      placeholder="ahmed@email.com"
                      className={`w-full px-6 py-5 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-3xl focus:border-primary-600 focus:ring-0 transition-all font-bold text-gray-950 placeholder:text-gray-300`}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Téléphone (Optionnel)</label>
                    <input
                      {...register('phone')}
                      placeholder="+216 20 000 000"
                      className="w-full px-6 py-5 bg-white border border-gray-200 rounded-3xl focus:border-primary-600 focus:ring-0 transition-all font-bold text-gray-950 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Sujet</label>
                    <select
                      {...register('subject', { required: true })}
                      className="w-full px-6 py-5 bg-white border border-gray-200 rounded-3xl focus:border-primary-600 focus:ring-0 transition-all font-bold text-gray-950"
                    >
                      <option value="Information">Demande d'information</option>
                      <option value="Devis">Demande de devis</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Recrutement">Recrutement</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Votre message</label>
                  <textarea
                    {...register('content', { required: true })}
                    rows={6}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className={`w-full px-6 py-5 bg-white border ${errors.content ? 'border-red-500' : 'border-gray-200'} rounded-3xl focus:border-primary-600 focus:ring-0 transition-all font-bold text-gray-950 placeholder:text-gray-300 resize-none font-outfit`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Envoyer le message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
