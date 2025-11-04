
import React from 'react';

interface SummaryProps {
  summary: string;
  country: string;
}

const Summary: React.FC<SummaryProps> = ({ summary, country }) => {
  return (
    <section className="mb-12 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <h2 className="text-3xl font-bold text-gray-100 mb-4">
        News Summary for <span className="text-blue-400 capitalize">{country}</span>
      </h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
    </section>
  );
};

export default Summary;
