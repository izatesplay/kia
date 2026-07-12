import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle, MapPin, Phone, MessageSquare, Shield } from 'lucide-react';
import { ContactMessage } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface ContactProps {
  onAddMessage: (msg: ContactMessage) => void;
}

export default function Contact({ onAddMessage }: ContactProps) {
  const { language, isRtl, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate network delay for nostalgic dial-up feel (1.5 seconds)
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        email: formData.email,
        subject: formData.subject || (language === 'fa' ? 'همکاری عمومی' : 'General Collaboration'),
        message: formData.message,
        createdAt: new Date().toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US') + ' ' + new Date().toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };

      // Add to shared inbox state
      onAddMessage(newMessage);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success banner after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    }, 1500);
  };

  return (
    <section id="contact" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-5xl font-display text-gold-400 gold-glow">
          {t('contactTitle')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
        <p className="text-gray-400 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          {t('contactDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Card (5 Cols) */}
        <div className={`lg:col-span-5 space-y-6 order-2 lg:order-1 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          <div 
            className="bg-site-surface border border-gold-400/15 p-6 rounded-2xl space-y-6 font-sans"
            style={{ backgroundColor: 'var(--site-surface)' }}
          >
            <h3 className="text-md font-bold text-white mb-4">{t('contactCardTitle')}</h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('emailLabel')}</span>
                  <a href="mailto:kianourpartovi@gmail.com" className="text-xs text-gray-300 hover:text-gold-400 transition-colors">
                    kianourpartovi@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('phoneLabel')}</span>
                  <a href="tel:+989396460464" className="text-xs text-gray-300 hover:text-gold-400 transition-colors" dir="ltr">
                    +98 939 646 0464
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('addressLabel')}</span>
                  <span className="text-xs text-gray-300">{t('officeAddress')}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gold-400/10 pt-4 text-xs text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-400/60" />
              <span>{t('workHoursLabel')} {t('workHoursValue')}</span>
            </div>
          </div>

          {/* Social connections badge */}
          <div className={`p-5 rounded-2xl bg-gradient-to-br from-gold-950/10 to-gold-900/10 border border-gold-500/10 ${isRtl ? 'text-right' : 'text-left'} font-sans`}>
            <h4 className="text-xs font-bold text-gold-400 mb-2">{t('formTitle')}:</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {t('contactCardDesc')}
            </p>
          </div>
        </div>

        {/* Custom Retro Form (7 Cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div 
            className="bg-site-surface border-2 border-gold-400 rounded-2xl p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.8)] relative overflow-hidden"
            style={{ backgroundColor: 'var(--site-surface)' }}
          >
            
            {/* Success Notification Banner */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-x-0 top-0 bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-300 p-4 flex items-center gap-3 justify-center z-10 text-right font-sans text-xs"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold">{t('successMsg')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className={`space-y-5 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-gray-400">
                    {t('inputName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder={t('inputName')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1c1914] border border-gold-400/20 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-gray-400">
                    {t('inputEmail')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1c1914] border border-gold-400/20 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-colors text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-gray-400">
                  {t('inputSubject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder={t('inputSubject')}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#1c1914] border border-gold-400/20 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-gray-400">
                  {t('inputMessage')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder={t('inputMessage')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#1c1914] border border-gold-400/20 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-colors resize-none"
                />
              </div>

              {/* Submit button with loading state */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-lg border border-gold-300 font-bold font-sans text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                  isSubmitting
                    ? 'bg-gold-500/20 border-gold-500/20 text-gold-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:from-gold-500 hover:to-gold-300 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gold-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('sendingBtn')}</span>
                  </>
                ) : (
                  <>
                    <Send className={`w-4 h-4 text-black ${isRtl ? 'transform rotate-180' : ''}`} />
                    <span>{t('submitBtn')}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
