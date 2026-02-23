
import React from 'react';
import Feedback from './Feedback';
import { WhatsAppIcon, LinkedInIcon, ShareIcon } from './IconComponents';

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

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareSummary)}`, '_blank');
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareSummary)}`, '_blank');
  };

  return (
    <section className="mb-12 bg-gray-800/50 border border-gray-700 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
      
      <h2 className="text-3xl font-bold text-gray-100 relative z-10">
        News Summary for <span className="text-blue-400">{country}</span>
      </h2>
      <p className="text-gray-400 mb-6 relative z-10">Period: {formattedDate}</p>
      
      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed relative z-10">
        {summary.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Share Report</span>
          <div className="flex gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full hover:bg-green-600 hover:text-white transition-all text-sm font-semibold"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </button>
            <button
              onClick={handleLinkedIn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full hover:bg-blue-600 hover:text-white transition-all text-sm font-semibold"
            >
              <LinkedInIcon className="h-4 w-4" /> LinkedIn
            </button>
          </div>
        </div>
        
        <div className="w-full sm:w-1/3">
          <Feedback id={feedbackId} type="summary" />
        </div>
      </div>
    </section>
  );
};

export default Summary;
