import React, { useEffect, useState, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from './config.js';

// Bible API IDs for KJV and NLT versions
const KJV_ID = 'de4e12af7f28f599-01';
const NLT_ID = '65eec8e0b60e656b-01';

// Highlight color options
const HIGHLIGHT_COLORS = {
  yellow: '#fff3cd',
  green: '#d4edda',
  blue: '#d1ecf1',
  pink: '#f8d7da',
  purple: '#e2d9f3',
  orange: '#ffeaa7'
};

function BiblePage() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState('');
  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState('');
  const [kjvText, setKjvText] = useState('');
  const [nltText, setNltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nltError, setNltError] = useState('');
  const [kjvError, setKjvError] = useState('');
  
  // New state for enhanced features
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showHighlightTools, setShowHighlightTools] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState({});
  const [currentHighlightColor, setCurrentHighlightColor] = useState('yellow');
  
  // Refs for scrolling
  const kjvRef = useRef(null);
  const nltRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Helper function to format passage reference
  const formatPassageRef = (bookId, chapterNum) => {
    if (!bookId || !chapterNum) return null;
    if (chapterNum === 'intro') return null;
    return `${bookId}.${chapterNum}`;
  };

  // Helper function to make API requests
  const makeRequest = useCallback(async (endpoint, body) => {
    console.log('Making request to:', endpoint);
    console.log('Request body:', body);
    
    try {
    const response = await fetch(endpoint, {
      method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      body: JSON.stringify(body)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`${response.status} ${response.statusText}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
    } catch (err) {
      console.error('Request failed:', err);
      
      // Check if it's a CORS error
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        console.error('CORS error detected - backend may be deploying or CORS not configured');
        setError('Backend is currently unavailable. Please try again in a few minutes. If the problem persists, the backend may be deploying updates.');
      }
      
      throw err;
    }
  }, []);

  // Navigation functions
  const navigateToChapter = (newChapter) => {
    if (newChapter >= 1 && newChapter <= chapters.length) {
      setChapter(newChapter.toString());
    }
  };

  const navigateToVerse = (newVerse) => {
    // Scroll to the specific verse if it exists in the real content
    const verseElement = document.querySelector(`[data-verse="${newVerse}"]`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Scroll to top of content
  const scrollToTop = () => {
    kjvRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    nltRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save notes to localStorage
  const saveNotes = useCallback(() => {
    const notesKey = `bible_notes_${book}_${chapter}`;
    localStorage.setItem(notesKey, notes);
  }, [book, chapter, notes]);

  // Load notes from localStorage
  const loadNotes = useCallback(() => {
    const notesKey = `bible_notes_${book}_${chapter}`;
    const savedNotes = localStorage.getItem(notesKey);
    setNotes(savedNotes || '');
  }, [book, chapter]);

  // Highlight functionality
  const saveHighlights = useCallback(() => {
    const highlightsKey = `bible_highlights_${book}_${chapter}`;
    localStorage.setItem(highlightsKey, JSON.stringify(highlights));
  }, [book, chapter, highlights]);

  const loadHighlights = useCallback(() => {
    const highlightsKey = `bible_highlights_${book}_${chapter}`;
    const savedHighlights = localStorage.getItem(highlightsKey);
    setHighlights(savedHighlights ? JSON.parse(savedHighlights) : {});
  }, [book, chapter]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      setSelectedText(selectedText);
      setShowHighlightTools(true);
    }
  };

  const addHighlight = () => {
    if (!selectedText) return;
    
    console.log('Adding highlight for text:', selectedText);
    console.log('Current highlight color:', currentHighlightColor);
    console.log('Color value:', HIGHLIGHT_COLORS[currentHighlightColor]);
    
    const newHighlight = {
      text: selectedText,
      color: HIGHLIGHT_COLORS[currentHighlightColor],
      timestamp: new Date().toISOString()
    };
    
    const newHighlights = {
      ...highlights,
      [selectedText]: newHighlight
    };
    
    console.log('New highlights object:', newHighlights);
    setHighlights(newHighlights);
    setSelectedText('');
    setShowHighlightTools(false);
    
    // Clear selection
    window.getSelection().removeAllRanges();
  };

  const applyHighlightsToText = (text) => {
    if (!text || Object.keys(highlights).length === 0) {
      console.log('No text or highlights to apply');
      return text;
    }
    
    console.log('Applying highlights to text. Current highlights:', highlights);
    console.log('Text length:', text.length);
    
    let highlightedText = text;
    
    // Sort highlights by length (longest first) to avoid partial matches
    const sortedHighlights = Object.entries(highlights).sort((a, b) => b[0].length - a[0].length);
    
    sortedHighlights.forEach(([searchText, highlight]) => {
      if (searchText && highlight.color) {
        try {
          const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedText})`, 'gi');
          const matches = text.match(regex);
          console.log(`Looking for "${searchText}" - found ${matches ? matches.length : 0} matches`);
          
          highlightedText = highlightedText.replace(regex, 
            `<span style="background-color: ${highlight.color}; padding: 2px 4px; border-radius: 3px; display: inline;">$1</span>`
          );
        } catch (err) {
          console.error('Error applying highlight for text:', searchText, err);
        }
      }
    });
    
    console.log('Highlighted text length:', highlightedText.length);
    return highlightedText;
  };

  // Fetch books on mount
  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await makeRequest(API_ENDPOINTS.bibleBooks, { bibleId: KJV_ID });
        if (data.data && data.data.length > 0) {
          setBooks(data.data);
          setBook(data.data[0].id);
        } else {
          throw new Error('No books returned from API');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Backend is currently unavailable. Please try again in a few minutes.');
        // Set a minimal fallback to prevent complete app failure
        setBooks([{ id: 'gen', name: 'Genesis' }]);
        setBook('gen');
      }
    }
    fetchBooks();
  }, [makeRequest]);

  // Fetch chapters when book changes
  useEffect(() => {
    if (!book) return;
    
    async function fetchChapters() {
      try {
        const data = await makeRequest(API_ENDPOINTS.bibleChapters, { 
          bibleId: KJV_ID, 
          bookId: book 
        });
        if (data.data && data.data.length > 0) {
          const validChapters = data.data.filter(c => c.number !== 'intro');
          setChapters(validChapters);
          if (validChapters.length > 0) {
            setChapter(validChapters[0].number);
          }
        } else {
          throw new Error('No chapters returned from API');
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Failed to load chapters: ' + err.message);
      }
    }
    fetchChapters();
  }, [book, makeRequest]);

  // Fetch passages when book or chapter changes
  useEffect(() => {
    if (!book || !chapter) return;
    
    async function fetchPassages() {
      setLoading(true);
      setError('');
      setKjvError('');
      setNltError('');
      
      const passageRef = formatPassageRef(book, chapter);
      if (!passageRef) {
        setLoading(false);
        return;
      }
      
      console.log('Fetching passage:', passageRef);

      try {
        // KJV
        const kjvData = await makeRequest(API_ENDPOINTS.bible, {
          bibleId: KJV_ID,
          passage: passageRef
        });
        setKjvText(kjvData.data?.content || '');
      } catch (err) {
        console.error('Error fetching KJV:', err);
        setKjvError('Failed to load KJV: ' + err.message);
      }

      try {
        // NLT
        const nltData = await makeRequest(API_ENDPOINTS.bible, {
          bibleId: NLT_ID,
          passage: passageRef
        });
        setNltText(nltData.data?.content || '');
      } catch (err) {
        console.error('Error fetching NLT:', err);
        setNltError('Failed to load NLT: ' + err.message);
      }

      setLoading(false);
    }
    fetchPassages();
  }, [book, chapter, makeRequest]);

  // Load notes and highlights when passage changes
  useEffect(() => {
    if (book && chapter) {
      loadNotes();
      loadHighlights();
    }
  }, [book, chapter, loadNotes, loadHighlights]);

  // Save highlights when they change
  useEffect(() => {
    if (Object.keys(highlights).length > 0) {
      saveHighlights();
    }
  }, [highlights, saveHighlights]);

  const currentBookName = books.find(b => b.id === book)?.name || '';
  const currentChapterNum = parseInt(chapter) || 1;

  // Bible search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setShowSearchModal(true);
    try {
      const res = await fetch(API_ENDPOINTS.bibleSearch, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ bibleId: KJV_ID, query: searchTerm, limit: 20 })
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data.data?.verses || []);
    } catch (err) {
      setSearchError('No results found or error searching.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle clicking a search result
  const handleResultClick = async (result) => {
    setShowSearchModal(false);
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    // result has: id, reference, text, etc.
    // Parse book and chapter from result.reference (e.g., "Genesis 1:31")
    const refMatch = result.reference.match(/^(.*?) (\d+):(\d+)/);
    if (refMatch) {
      const bookName = refMatch[1];
      const chapterNum = refMatch[2];
      // Find the book id from books list
      let foundBook = books.find(b => b.name.toLowerCase() === bookName.toLowerCase());
      if (!foundBook) {
        // fallback: try partial match
        foundBook = books.find(b => bookName.toLowerCase().includes(b.name.toLowerCase()));
      }
      if (foundBook) {
        setBook(foundBook.id);
        setChapter(chapterNum);
      }
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for any word, name, or phrase..."
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #bbb', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', background: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer' }}>Search</button>
      </form>

      {/* Search Modal */}
      {showSearchModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, maxWidth: 600, width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0 }}>Search Results</h2>
            {searchLoading && <div>Searching...</div>}
            {searchError && <div style={{ color: 'red', marginBottom: 12 }}>{searchError}</div>}
            {!searchLoading && !searchError && searchResults.length === 0 && <div>No results found.</div>}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {searchResults.map(result => (
                <li key={result.id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <button onClick={() => handleResultClick(result)} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', padding: 0 }}>
                    <div style={{ fontWeight: 'bold', color: '#007bff' }}>{result.reference}</div>
                    <div style={{ color: '#333', fontSize: 15 }}>{result.text}</div>
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowSearchModal(false)} style={{ marginTop: 18, background: '#dc3545', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Enhanced Header with Navigation */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '28px' }}>📖 Bible Study</h1>
        
        {/* Book and Chapter Navigation */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: '600' }}>Book:</label>
          <select 
            value={book} 
            onChange={e => setBook(e.target.value)} 
              style={{ 
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                minWidth: '150px'
              }}
            disabled={!books.length}
          >
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: '600' }}>Chapter:</label>
          <select 
            value={chapter} 
            onChange={e => setChapter(e.target.value)} 
              style={{ 
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                minWidth: '80px'
              }}
            disabled={!chapters.length}
          >
            {chapters.map(c => (
              <option key={c.id} value={c.number}>
                {c.number}
              </option>
            ))}
          </select>
          </div>
          
          {/* Chapter Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigateToChapter(currentChapterNum - 1)}
              disabled={currentChapterNum <= 1}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: currentChapterNum <= 1 ? '#ccc' : 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: currentChapterNum <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => navigateToChapter(currentChapterNum + 1)}
              disabled={currentChapterNum >= chapters.length}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: currentChapterNum >= chapters.length ? '#ccc' : 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: currentChapterNum >= chapters.length ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Next →
            </button>
          </div>
        </div>
        
        {/* Verse Navigation */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: '600' }}>Quick Navigation:</label>
            <button
              onClick={() => navigateToVerse(1)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⬆️ First Verse
            </button>
            <button
              onClick={() => navigateToVerse(10)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔟 Verse 10
            </button>
            <button
              onClick={() => navigateToVerse(20)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⬇️ Verse 20
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📝 {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          
          <button
            onClick={scrollToTop}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ⬆️ Scroll to Top
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: 12, 
          padding: 12, 
          background: '#ffebee', 
          borderRadius: 8,
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {/* Notes Section */}
      {showNotes && (
        <div style={{ 
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#856404' }}>
            📝 Notes for {currentBookName} Chapter {chapter}
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ffeaa7',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              onClick={saveNotes}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💾 Save Notes
            </button>
            <button
              onClick={() => setNotes('')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🗑️ Clear Notes
            </button>
          </div>
        </div>
      )}

      {/* Highlight Tools */}
      {showHighlightTools && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 1000,
          border: '2px solid #007bff'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>🎨 Highlight Text</h4>
          <div style={{ marginBottom: '16px' }}>
            <strong>Selected text:</strong> "{selectedText}"
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Choose color:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(HIGHLIGHT_COLORS).map(([name, color]) => (
                <button
                  key={name}
                  onClick={() => setCurrentHighlightColor(name)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: currentHighlightColor === name ? '3px solid #007bff' : '2px solid #ccc',
                    background: color,
                    cursor: 'pointer'
                  }}
                  title={name}
                />
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={addHighlight}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✅ Add Highlight
            </button>
            <button
              onClick={() => {
                setShowHighlightTools(false);
                setSelectedText('');
                window.getSelection().removeAllRanges();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#6c757d',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bible Content */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '12px',
          fontSize: '18px',
          color: '#6c757d'
        }}>
          📖 Loading Bible passage...
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* KJV Column */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: '#f8f9fa', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            maxHeight: '600px',
            overflowY: 'auto',
            paddingBottom: '40px'
          }} 
          ref={kjvRef}
          onMouseUp={handleTextSelection}
          >
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#495057',
              borderBottom: '2px solid #007bff',
              paddingBottom: '8px'
            }}>
              📜 King James Version (KJV)
            </h3>
            {kjvError ? (
              <div style={{ 
                color: 'red', 
                padding: 12, 
                background: '#ffebee', 
                borderRadius: 8,
                border: '1px solid #ffcdd2'
              }}>
                {kjvError}
              </div>
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: applyHighlightsToText(kjvText) }}
                style={{ lineHeight: '1.6', fontSize: '16px' }}
              />
            )}
          </div>
          
          {/* NLT Column */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: '#e3f2fd', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #bbdefb',
            maxHeight: '600px',
            overflowY: 'auto',
            paddingBottom: '40px'
          }} 
          ref={nltRef}
          onMouseUp={handleTextSelection}
          >
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#1565c0',
              borderBottom: '2px solid #2196f3',
              paddingBottom: '8px'
            }}>
              📖 New Living Translation (NLT)
            </h3>
            {nltError ? (
              <div style={{ 
                color: 'red', 
                padding: 12, 
                background: '#ffebee', 
                borderRadius: 8,
                border: '1px solid #ffcdd2'
              }}>
                {nltError}
              </div>
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: applyHighlightsToText(nltText) }}
                style={{ lineHeight: '1.6', fontSize: '16px' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BiblePage; 