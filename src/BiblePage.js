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

  // Fallback content when backend is unavailable
  const fallbackContent = {
    books: [
      { id: 'gen', name: 'Genesis' },
      { id: 'exo', name: 'Exodus' },
      { id: 'mat', name: 'Matthew' },
      { id: 'mar', name: 'Mark' },
      { id: 'luk', name: 'Luke' },
      { id: 'jhn', name: 'John' }
    ],
    sampleText: {
      kjv: `<p><strong>Genesis 1:1-5 (KJV)</strong></p>
      <p>1 In the beginning God created the heaven and the earth.</p>
      <p>2 And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.</p>
      <p>3 And God said, Let there be light: and there was light.</p>
      <p>4 And God saw the light, that it was good: and God divided the light from the darkness.</p>
      <p>5 And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.</p>`,
      nlt: `<p><strong>Genesis 1:1-5 (NLT)</strong></p>
      <p>1 In the beginning God created the heavens and the earth.</p>
      <p>2 The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.</p>
      <p>3 Then God said, "Let there be light," and there was light.</p>
      <p>4 And God saw that the light was good. Then he separated the light from the darkness.</p>
      <p>5 God called the light "day" and the darkness "night." And evening passed and morning came, marking the first day.</p>`
    }
  };

  // Check if we should use fallback mode
  const [useFallback, setUseFallback] = useState(false);

  // Helper function to format passage reference
  const formatPassageRef = (bookId, chapterNum) => {
    if (!bookId || !chapterNum) return null;
    if (chapterNum === 'intro') return null;
    return `${bookId}.${chapterNum}`;
  };

  // Helper function to make API requests
  async function makeRequest(endpoint, body) {
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
  }

  // Navigation functions
  const navigateToChapter = (newChapter) => {
    if (newChapter >= 1 && newChapter <= chapters.length) {
      setChapter(newChapter.toString());
    }
  };

  // Scroll to top of content
  const scrollToTop = () => {
    kjvRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    nltRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save notes to localStorage
  const saveNotes = () => {
    const notesKey = `bible_notes_${book}_${chapter}`;
    localStorage.setItem(notesKey, notes);
  };

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

  const removeHighlight = (text) => {
    const newHighlights = { ...highlights };
    delete newHighlights[text];
    setHighlights(newHighlights);
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
          setUseFallback(false);
        } else {
          throw new Error('No books returned from API');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        console.log('Switching to fallback mode');
        setUseFallback(true);
        setBooks(fallbackContent.books);
        setBook(fallbackContent.books[0].id);
        setKjvText(fallbackContent.sampleText.kjv);
        setNltText(fallbackContent.sampleText.nlt);
        setError('Backend is currently unavailable. Showing sample content. You can still use highlighting and notes features.');
      }
    }
    fetchBooks();
  }, []);

  // Fetch chapters when book changes
  useEffect(() => {
    if (!book || useFallback) return;
    
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
  }, [book, useFallback]);

  // Fetch passages when book or chapter changes
  useEffect(() => {
    if (!book || !chapter || useFallback) return;
    
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
  }, [book, chapter, useFallback]);

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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
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

      {/* Highlights List */}
      {Object.keys(highlights).length > 0 && (
        <div style={{ 
          background: '#e8f5e8',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #c3e6c3'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#155724' }}>🎨 Your Highlights</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(highlights).map(([text, highlight]) => (
              <div
                key={text}
                style={{
                  background: highlight.color,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  maxWidth: '200px'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {text}
                </span>
                <button
                  onClick={() => removeHighlight(text)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Debug Info */}
          <details style={{ marginTop: '12px' }}>
            <summary style={{ cursor: 'pointer', color: '#155724', fontWeight: '600' }}>
              🔧 Debug Info
            </summary>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '8px', 
              borderRadius: '4px', 
              fontSize: '12px',
              marginTop: '8px',
              overflow: 'auto'
            }}>
              {JSON.stringify(highlights, null, 2)}
            </pre>
          </details>
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
            overflowY: 'auto'
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
            overflowY: 'auto'
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