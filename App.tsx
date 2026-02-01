
import React, { useState, useCallback } from 'react';
import { MOODS } from './constants';
import { Mood, CurationResponse } from './types';
import { curateBooks } from './geminiService';
import MoodCard from './components/MoodCard';
import Loader from './components/Loader';
import BookGrid from './components/BookGrid';

type ViewState = 'selection' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('selection');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [recommendations, setRecommendations] = useState<CurationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shownTitles, setShownTitles] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState('');

  const handleMoodSelect = useCallback(async (mood: Mood) => {
    setSelectedMood(mood);
    setView('loading');
    setError(null);
    setRecommendations(null);
    setShownTitles([]);

    try {
      const result = await curateBooks(mood.label, mood.description);
      setRecommendations(result);
      setShownTitles(result.books.map(b => b.title));
      setView('results');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while curating your books.');
      setView('selection');
    }
  }, []);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMood.trim()) return;

    const dummyMood: Mood = {
      id: 'custom',
      label: 'Unique',
      emoji: '💭',
      color: 'bg-slate-50',
      description: customMood
    };

    setSelectedMood(dummyMood);
    setView('loading');
    setError(null);
    setRecommendations(null);
    setShownTitles([]);

    try {
      const result = await curateBooks('custom mood', customMood);
      setRecommendations(result);
      setShownTitles(result.books.map(b => b.title));
      setView('results');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while curating your books.');
      setView('selection');
    }
  };

  const handleRefresh = useCallback(async () => {
    if (!selectedMood) return;
    
    setView('loading');
    setError(null);

    try {
      const result = await curateBooks(selectedMood.label, selectedMood.description, shownTitles);
      setRecommendations(result);
      setShownTitles(prev => [...prev, ...result.books.map(b => b.title)]);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while refreshing your books.');
      setView('results');
    }
  }, [selectedMood, shownTitles]);

  const handleBack = () => {
    setView('selection');
    setRecommendations(null);
    setSelectedMood(null);
    setError(null);
    setShownTitles([]);
    setCustomMood('');
  };

  return (
    <div className="min-h-screen text-[#1d1d1f] selection:bg-blue-100 bg-[#fbfbfd]">
      <nav className="sticky top-0 z-50 bg-white/80 apple-blur border-b border-gray-100 py-3 px-8 lg:px-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 font-semibold text-base tracking-tight cursor-pointer"
            onClick={handleBack}
          >
            <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px]">MR</span>
            MoodReader
          </div>
          <div className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Discover</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Library</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Journal</span>
          </div>
        </div>
      </nav>

      <main className="transition-all duration-500">
        {view === 'selection' && (
          <div className="animate-in fade-in duration-700 max-w-5xl mx-auto px-8 lg:px-12">
            <header className="relative pt-24 pb-20">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight serif text-gray-900 leading-tight">
                  How does your soul <br />
                  <span className="text-blue-600 italic">feel</span> today?
                </h1>
                <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed font-light">
                  Tell us your mood, and our AI curator will find contemporary literature perfectly tuned to your emotions.
                </p>
                {error && (
                  <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-full text-[10px] font-medium border border-red-100 max-w-xs mx-auto">
                    {error}
                  </div>
                )}
              </div>
            </header>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
              {MOODS.map((mood) => (
                <MoodCard
                  key={mood.id}
                  mood={mood}
                  isSelected={false}
                  onSelect={handleMoodSelect}
                />
              ))}
            </section>

            <section className="max-w-xl mx-auto pb-32">
              <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-[1px] bg-gray-100"></div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Or specify your state</p>
                <form onSubmit={handleCustomSubmit} className="w-full relative group">
                  <input
                    type="text"
                    value={customMood}
                    onChange={(e) => setCustomMood(e.target.value)}
                    placeholder="Describe how you're feeling in detail..."
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-light text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-50/50 focus:border-blue-200 transition-all placeholder:text-gray-300 shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!customMood.trim()}
                    className="absolute right-3 top-2.5 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-0 disabled:translate-x-4"
                  >
                    Find
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {view === 'loading' && (
          <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <Loader />
          </div>
        )}

        {view === 'results' && recommendations && selectedMood && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto px-8 lg:px-12 pt-16 pb-40">
            <div className="flex justify-between items-center mb-16">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform group"
              >
                <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Return
              </button>

              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Show more
              </button>
            </div>

            <div className="mb-24 text-center">
              <div className="inline-flex flex-col items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${selectedMood.color}`}>
                  {selectedMood.emoji}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 serif mb-1">
                    {selectedMood.id === 'custom' ? 'A Personal' : `The ${selectedMood.label}`} Collection
                  </h2>
                  <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.3em]">
                    {selectedMood.id === 'custom' ? 'Matched to your words' : 'Curated Modern Gems'}
                  </p>
                </div>
              </div>
              <p className="text-base text-gray-500 font-light leading-relaxed max-w-xl mx-auto italic">
                "{recommendations.curatorNote}"
              </p>
            </div>

            <BookGrid books={recommendations.books} />

            <div className="mt-32 flex flex-col items-center gap-6">
              <p className="text-gray-400 font-light text-xs tracking-wide">Looking for something else?</p>
              <button 
                onClick={handleRefresh}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em]"
              >
                Show more books
              </button>
            </div>

            {recommendations.links.length > 0 && (
              <div className="mt-40 pt-16 border-t border-gray-100">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">Context & Sources</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {recommendations.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-[10px] text-gray-600 transition-all flex items-center gap-2 group shadow-sm"
                    >
                      <span className="font-semibold">{link.title}</span>
                      <svg className="w-3 h-3 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {view === 'selection' && (
        <footer className="mt-20 py-20 bg-white border-t border-gray-100 px-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
            <h3 className="font-bold text-sm text-gray-900 tracking-widest uppercase">MoodReader</h3>
            <p className="text-gray-400 max-w-xs leading-relaxed font-light text-xs">
              A curated experience mapping human emotions to literature through intelligent synthesis.
            </p>
            <div className="pt-8 w-12 border-t border-gray-100"></div>
            <p className="text-[9px] text-gray-300 uppercase tracking-[0.3em]">© {new Date().getFullYear()} MoodReader</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
