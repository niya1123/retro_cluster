import { useState } from 'react';
import Head from 'next/head';
import { Cluster, NoteParsed } from '../types';
import { downloadCSV, generateCSV } from '../utils/csv';

export default function Home() {
  const [rawText, setRawText] = useState<string>('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [notes, setNotes] = useState<NoteParsed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle text area change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
  };

  // Handle group button click
  const handleGroupClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawText }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to group notes');
      }
      
      setClusters(data.clusters);
      setNotes(data.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error grouping notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (clusters.length > 0) {
      const csvContent = generateCSV(clusters, notes);
      downloadCSV(csvContent, 'retro_clusters.csv');
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <Head>
        <title>Retro Cluster</title>
        <meta name="description" content="Retrospective note clustering tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mt-8 mb-2">Retro Cluster</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Group your retrospective notes using AI-powered clustering
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={'K: テスト自動化が進んだ\nP: 本番障害が多い\nT: PR テンプレ整備する'}
              value={rawText}
              onChange={handleTextChange}
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
              onClick={handleGroupClick}
              disabled={isLoading || !rawText.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  グループ化中...
                </>
              ) : 'グループ化'}
            </button>
            
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              onClick={handleDownloadCSV}
              disabled={clusters.length === 0}
            >
              CSV ダウンロード
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </section>

        {clusters.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Clustered Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-500">
                      Group {cluster.id + 1}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      cluster.category === 'K' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      cluster.category === 'P' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {cluster.category}
                    </span>
                  </div>
                  
                  <p className="font-semibold mb-2">{cluster.representative}</p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {cluster.noteIds.length} notes in this group
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-16 pt-4 text-center text-sm text-gray-500 border-t">
        <p>© {new Date().getFullYear()} Retro Cluster</p>
      </footer>
    </div>
  );
}
