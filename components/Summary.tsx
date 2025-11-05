import React from 'react';
import Feedback from './Feedback';

interface SummaryProps {
  summary: string;
  country: string;
  date: string | null;
}

const Summary: React.FC<SummaryProps> = ({ summary, country, date }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }) : 'Latest';

  return (
    <section className="mb-12 bg-gray-800/50 border border-gray-700 p-6 md:p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-100">
        News Summary for <span className="text-blue-400">{country}</span>
      </h2>
      <p className="text-gray-400 mb-6">Date: {formattedDate}</p>
      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
        {summary.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Feedback id={`summary-${country}-${date || 'latest'}`} type="summary" />
    </section>
  );
};

export default Summary;
