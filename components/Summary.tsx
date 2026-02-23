
import React from 'react';
import Feedback from './Feedback';
import { WhatsAppIcon, LinkedInIcon, ShareIcon, XIcon, FacebookIcon } from './IconComponents';
import { motion } from 'motion/react';

interface SummaryProps {
  summary: string;
  country: string;
  startDate: string | null;
  endDate: string | null;
}

const Summary: React.FC<SummaryProps> = ({ summary, country, startDate, endDate }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  }

  const getDateDisplay = () => {
    if (startDate && endDate) {
      if (startDate === endDate) return formatDate(startDate);
      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    if (startDate) return `Since ${formatDate(startDate)}`;
    if (endDate) return `Until ${formatDate(endDate)}`;
    return 'Latest';
  };
  
  const formattedDate = getDateDisplay();
  const feedbackId = `summary-${country}-${startDate || 'latest'}-${endDate || 'latest'}`;

  const shareSummary = `🌎 *Global News Report: ${country}*\n📅 Period: ${formattedDate}\n\n*Summary Insights:*\n${summary.slice(0, 500)}...\n\n_Generated via Global News Deep Dive_`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareSummary)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareSummary)}`;
        break;
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareSummary)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareSummary)}`;
        break;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-12 bg-gray-900/60 border border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent to-blue-500/30"></div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Executive Summary</span>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent to-blue-500/30"></div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">
          {country} <span className="text-blue-500">Intelligence</span>
        </h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-10">Analysis Period: {formattedDate}</p>
        
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6 text-lg font-medium">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className={index === 0 ? "first-letter:text-4xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-1 first-letter:float-left" : ""}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-gray-800/50 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Distribute Intelligence</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600/10 text-green-400 border border-green-600/20 rounded-xl hover:bg-green-600 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </button>
              <button
                onClick={() => handleShare('x')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl hover:bg-white hover:text-black transition-all text-xs font-black uppercase tracking-widest"
              >
                <XIcon className="h-4 w-4" /> X
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-700/10 text-blue-500 border border-blue-700/20 rounded-xl hover:bg-blue-700 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <FacebookIcon className="h-4 w-4" /> Facebook
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Engagement Metrics</h3>
            <Feedback id={feedbackId} type="summary" />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Summary;
