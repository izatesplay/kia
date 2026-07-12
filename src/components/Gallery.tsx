import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export default function Gallery({ galleryItems }: GalleryProps) {
  const { language, isRtl, t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        if (isRtl) {
          handlePrev();
        } else {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, galleryItems, isRtl]);

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => 
      prev === 0 ? galleryItems.length - 1 : (prev as number) - 1
    );
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => 
      prev === galleryItems.length - 1 ? 0 : (prev as number) + 1
    );
  };

  const currentItem = selectedImageIndex !== null ? galleryItems[selectedImageIndex] : null;

  return (
    <section id="gallery" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 mb-16 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-400 text-xs font-bold tracking-wide uppercase font-sans">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{language === 'fa' ? 'گالری هنر کیانور' : 'Artistic Gallery'}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight leading-tight uppercase">
          {language === 'fa' ? 'گالری تصاویر و لحظات هنری' : 'Artistic Moments & Gallery'}
        </h2>
        <div className="w-24 h-[3px] bg-gold-400 mx-auto rounded-full shadow-[0_0_10px_rgba(211,166,85,0.5)]" />
        <p className="max-w-2xl mx-auto text-gray-400 font-sans text-sm md:text-base leading-relaxed">
          {language === 'fa' 
            ? 'قاب‌هایی صمیمی از نوازندگی‌های زنده، پشت‌صحنه تولید قطعات در استودیو نوستالژیا و لحظات متمایز دو دهه حضور مستمر در صنعت موسیقی.' 
            : 'Intimate frames from live performances, behind-the-scenes recordings at Nostalgia Studio, and signature moments of two decades in the music industry.'}
        </p>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <div className="text-center py-20 bg-[#111111]/40 border border-[#2c3338]/40 rounded-2xl p-8 max-w-md mx-auto">
          <ImageIcon className="w-12 h-12 text-gold-400/30 mx-auto mb-4" />
          <p className="text-gray-400 font-sans text-sm">
            {language === 'fa' ? 'هنوز تصویری در گالری آپلود نشده است.' : 'No images have been uploaded to the gallery yet.'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          layout
        >
          {galleryItems.map((item, index) => {
            const title = language === 'fa' ? (item.title || 'بدون عنوان') : (item.titleEn || item.title || 'Untitled');
            const desc = language === 'fa' ? item.description : (item.descriptionEn || item.description);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                className="group relative bg-[#0d0d0d] border border-[#2c3338]/30 rounded-2xl overflow-hidden shadow-2xl hover:border-gold-400/30 transition-all duration-500 cursor-pointer aspect-[4/3] flex items-center justify-center"
                onClick={() => setSelectedImageIndex(index)}
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Golden Overlay and details sliding up */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                
                {/* Zoom Icon indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-gold-400 p-2.5 rounded-full border border-gold-400/20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {/* Content sliding up */}
                <div className={`absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {item.createdAt && (
                    <div className="flex items-center gap-1.5 text-[10px] text-gold-400/80 font-bold mb-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{item.createdAt}</span>
                    </div>
                  )}
                  <h3 className="text-white text-base md:text-lg font-sans font-bold tracking-tight mb-1 group-hover:text-gold-400 transition-colors duration-300">
                    {title}
                  </h3>
                  {desc && (
                    <p className="text-gray-300 font-sans text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Immersive Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 hover:bg-white/20 text-white hover:text-gold-400 p-3 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
              title={language === 'fa' ? 'بستن' : 'Close'}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Main Lightbox Body with Image and Navigation */}
            <div 
              className="w-full max-w-5xl flex-grow flex items-center justify-between gap-4 py-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 bg-black/50 hover:bg-gold-400/25 border border-white/10 hover:border-gold-400/40 text-white hover:text-gold-400 p-3 md:p-4 rounded-full transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                title={language === 'fa' ? 'تصویر قبلی' : 'Previous Image'}
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Main Image View */}
              <div className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden select-none">
                <motion.img
                  key={currentItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={currentItem.imageUrl}
                  alt={language === 'fa' ? (currentItem.title || '') : (currentItem.titleEn || '')}
                  className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.8)] border border-white/5"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 bg-black/50 hover:bg-gold-400/25 border border-white/10 hover:border-gold-400/40 text-white hover:text-gold-400 p-3 md:p-4 rounded-full transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                title={language === 'fa' ? 'تصویر بعدی' : 'Next Image'}
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-3xl bg-[#090909]/80 backdrop-blur-md border border-[#2c3338]/40 rounded-2xl p-5 md:p-6 mb-4 text-center space-y-2 select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-gold-400/90 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentItem.createdAt || (language === 'fa' ? 'ثبت شده' : 'Recorded')}</span>
              </div>
              <h3 className="text-white text-lg md:text-xl font-sans font-black tracking-tight">
                {language === 'fa' ? (currentItem.title || 'بدون عنوان') : (currentItem.titleEn || currentItem.title || 'Untitled')}
              </h3>
              {(currentItem.description || currentItem.descriptionEn) && (
                <p className="text-gray-300 font-sans text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                  {language === 'fa' ? currentItem.description : (currentItem.descriptionEn || currentItem.description)}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
