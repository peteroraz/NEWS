
import React, { useState, useCallback, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import Summary from './components/Summary';
import CategorySection from './components/CategorySection';
import LoadingSpinner from './components/LoadingSpinner';
import CategoryFilter from './components/CategoryFilter';
import TrendingStories from './components/TrendingStories';
import SocialMediaSection from './components/SocialMediaSection';
import { fetchNewsAndSummary, generateCommentary } from './services/geminiService';
import type { CategorizedNews, CommentaryTone, Headline, SocialMediaStory, NewsData } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { BackIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [country, setCountry] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<string>('');
  const [searchEndDate, setSearchEndDate] = useState<string>('');
  const [categorizedNews, setCategorizedNews] = useState<CategorizedNews | null>(null);
  const [trendingNews, setTrendingNews] = useState<Headline[]>([]);
  const [socialMediaNews, setSocialMediaNews] = useState<SocialMediaStory[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [commentaries, setCommentaries] = useState<Record<string, string>>({});
  const [loadingCommentary, setLoadingCommentary] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchHistory, setSearchHistory] = useState<NewsData[]>([]);

  const reportId = useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), [country]);

  const handleSearch = useCallback(async (searchCountry: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    setCategorizedNews(null);
    setTrendingNews([]);
    setSocialMediaNews([]);
    setSummary('');
    setCommentaries({});
    setCountry(searchCountry);
    setSearchStartDate(startDate);
    setSearchEndDate(endDate);
    setSelectedCategory('all');

    try {
      const data = await fetchNewsAndSummary(searchCountry, startDate, endDate);
      setSummary(data.summary);
      setCategorizedNews(data.categories);
      setTrendingNews(data.trending);
      setSocialMediaNews(data.socialMedia);
      
      // Save to history for "Go Back"
      setSearchHistory(prev => [data, ...prev.slice(0, 4)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoBack = () => {
    if (searchHistory.length > 1) {
      const previous = searchHistory[1];
      setSummary(previous.summary);
      setCategorizedNews(previous.categories);
      setTrendingNews(previous.trending);
      setSocialMediaNews(previous.socialMedia);
      setSearchHistory(prev => prev.slice(1));
    } else {
      setCategorizedNews(null);
      setTrendingNews([]);
      setSocialMediaNews([]);
      setSummary('');
      setSearchHistory([]);
    }
  };

  const handleGenerateCommentary = useCallback(async (headline: string, tone: CommentaryTone) => {
    setLoadingCommentary(headline);
    try {
      const commentary = await generateCommentary(headline, tone);
      setCommentaries(prev => ({ ...prev, [headline]: commentary }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate commentary.';
      setCommentaries(prev => ({ ...prev, [headline]: `Error: ${errorMessage}` }));
    } finally {
      setLoadingCommentary(null);
    }
  }, []);
  
  const filteredNews = useMemo(() => {
    if (!categorizedNews) {
      return null;
    }
    if (selectedCategory === 'all') {
      return categorizedNews;
    }
    const filtered: CategorizedNews = {};
    const lowercasedSelectedCategory = selectedCategory.toLowerCase();
    const categoryKey = Object.keys(categorizedNews).find(key => key.toLowerCase() === lowercasedSelectedCategory);

    if (categoryKey && categorizedNews[categoryKey]) {
      filtered[categoryKey] = categorizedNews[categoryKey];
    }
    return filtered;
  }, [categorizedNews, selectedCategory]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <LoadingSpinner size="lg" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <p className="text-xl text-gray-300">Scanning global networks for {country}...</p>
            <p className="text-gray-500 italic">Assembling intelligence report. This may take a moment.</p>
          </motion.div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-20 text-center bg-red-900/50 border border-red-700 p-6 rounded-lg max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-red-300">Intelligence Fetch Failure</h3>
          <p className="text-red-400 mt-2">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (categorizedNews) {
      const availableCategories = Object.keys(categorizedNews);
      if (availableCategories.length === 0) {
        return (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-gray-400">No News Found</h2>
            <p className="text-gray-500 mt-2">The digital archives are quiet for {country} in this period. Try a different date range or region.</p>
            <button 
              onClick={handleGoBack}
              className="mt-6 flex items-center gap-2 mx-auto text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase text-xs tracking-widest"
            >
              <BackIcon className="h-4 w-4" /> Go Back
            </button>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-12"
        >
          <div className="flex justify-between items-center">
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]"
            >
              <BackIcon className="h-4 w-4" /> Go Back
            </button>
            <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em]">
              Report ID: {reportId}
            </div>
          </div>

          {summary && <Summary summary={summary} country={country} startDate={searchStartDate} endDate={searchEndDate} />}

          {trendingNews && trendingNews.length > 0 && <TrendingStories stories={trendingNews} />}

          {socialMediaNews && socialMediaNews.length > 0 && <SocialMediaSection stories={socialMediaNews} />}

          {availableCategories.length > 0 && (
            <div className="flex flex-col items-center">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Intelligence Filter</h3>
              <CategoryFilter
                categories={availableCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}
          
          <div className="space-y-16">
            {filteredNews && Object.entries(filteredNews).map(([category, headlines]) => (
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
        </motion.div>
      );
    }

    return (
      <div className="text-center mt-20 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-2xl shadow-blue-500/10"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
           </svg>
        </motion.div>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Ready to Deep Dive?</h2>
        <p className="text-gray-500 mt-4 max-w-sm leading-relaxed">Select a nation to analyze real-time headlines and trending narratives through AI-driven lenses.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-teal-300 tracking-tight">
            DEEP DIVE
          </h1>
          <p className="mt-4 text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            AI-Augmented Global News Analysis
          </p>
        </header>

        <div className="sticky top-4 z-50 bg-gray-900/60 backdrop-blur-md p-4 rounded-3xl border border-gray-800 shadow-2xl flex justify-center transition-all">
            <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
        
        {renderContent()}

      </main>
      <footer className="text-center py-12 border-t border-gray-800/50 mt-12">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="h-1 w-1 rounded-full bg-blue-500"></div>
           <div className="h-1 w-1 rounded-full bg-blue-400"></div>
           <div className="h-1 w-1 rounded-full bg-blue-300"></div>
        </div>
        <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Powered by Gemini 3.1 Intelligence</p>
      </footer>
    </div>
  );
};

export default App;
