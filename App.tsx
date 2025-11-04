
import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import Summary from './components/Summary';
import CategorySection from './components/CategorySection';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchNewsAndSummary, generateCommentary } from './services/geminiService';
import type { CategorizedNews } from './types';

const App: React.FC = () => {
  const [country, setCountry] = useState<string>('');
  const [categorizedNews, setCategorizedNews] = useState<CategorizedNews | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [commentaries, setCommentaries] = useState<Record<string, string>>({});
  const [loadingCommentary, setLoadingCommentary] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchCountry: string) => {
    setLoading(true);
    setError(null);
    setCategorizedNews(null);
    setSummary('');
    setCommentaries({});
    setCountry(searchCountry);

    try {
      const data = await fetchNewsAndSummary(searchCountry);
      setSummary(data.summary);
      setCategorizedNews(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerateCommentary = useCallback(async (headline: string) => {
    setLoadingCommentary(headline);
    try {
      const commentary = await generateCommentary(headline);
      setCommentaries(prev => ({ ...prev, [headline]: commentary }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate commentary.';
      setCommentaries(prev => ({ ...prev, [headline]: `Error: ${errorMessage}` }));
    } finally {
      setLoadingCommentary(null);
    }
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-xl text-gray-300">Searching the globe for {country}...</p>
          <p className="text-gray-500">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-20 text-center bg-red-900/50 border border-red-700 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-red-300">An Error Occurred</h3>
          <p className="text-red-400 mt-2">{error}</p>
        </div>
      );
    }

    if (categorizedNews) {
      return (
        <div className="mt-12 animate-fade-in">
          {summary && <Summary summary={summary} country={country} />}
          {Object.entries(categorizedNews).map(([category, headlines]) => (
            <CategorySection
              key={category}
              category={category}
              headlines={headlines}
              commentaries={commentaries}
              loadingCommentary={loadingCommentary}
              onGenerateCommentary={handleGenerateCommentary}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-400">Discover Global Headlines</h2>
        <p className="text-gray-500 mt-2">Enter a country above to begin your deep dive into the latest news.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Global News Deep Dive
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-3xl mx-auto">
            Your AI-powered portal to understanding the world, one country at a time.
          </p>
        </header>

        <div className="sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl flex justify-center">
            <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
        
        {renderContent()}

      </main>
      <footer className="text-center py-6 border-t border-gray-800">
        <p className="text-gray-500">Powered by Gemini</p>
      </footer>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default App;
