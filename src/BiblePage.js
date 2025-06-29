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

  // Check if we should use fallback mode
  const [useFallback, setUseFallback] = useState(false);

  // Memoize fallback content to avoid dependency issues
  const fallbackContentMemo = useCallback(() => ({
    books: [
      { id: 'gen', name: 'Genesis' },
      { id: 'exo', name: 'Exodus' },
      { id: 'lev', name: 'Leviticus' },
      { id: 'num', name: 'Numbers' },
      { id: 'deu', name: 'Deuteronomy' },
      { id: 'jos', name: 'Joshua' },
      { id: 'jdg', name: 'Judges' },
      { id: 'rut', name: 'Ruth' },
      { id: '1sa', name: '1 Samuel' },
      { id: '2sa', name: '2 Samuel' },
      { id: '1ki', name: '1 Kings' },
      { id: '2ki', name: '2 Kings' },
      { id: '1ch', name: '1 Chronicles' },
      { id: '2ch', name: '2 Chronicles' },
      { id: 'ezr', name: 'Ezra' },
      { id: 'neh', name: 'Nehemiah' },
      { id: 'est', name: 'Esther' },
      { id: 'job', name: 'Job' },
      { id: 'psa', name: 'Psalms' },
      { id: 'pro', name: 'Proverbs' },
      { id: 'ecc', name: 'Ecclesiastes' },
      { id: 'sng', name: 'Song of Solomon' },
      { id: 'isa', name: 'Isaiah' },
      { id: 'jer', name: 'Jeremiah' },
      { id: 'lam', name: 'Lamentations' },
      { id: 'ezk', name: 'Ezekiel' },
      { id: 'dan', name: 'Daniel' },
      { id: 'hos', name: 'Hosea' },
      { id: 'jol', name: 'Joel' },
      { id: 'amo', name: 'Amos' },
      { id: 'oba', name: 'Obadiah' },
      { id: 'jon', name: 'Jonah' },
      { id: 'mic', name: 'Micah' },
      { id: 'nam', name: 'Nahum' },
      { id: 'hab', name: 'Habakkuk' },
      { id: 'zep', name: 'Zephaniah' },
      { id: 'hag', name: 'Haggai' },
      { id: 'zec', name: 'Zechariah' },
      { id: 'mal', name: 'Malachi' },
      { id: 'mat', name: 'Matthew' },
      { id: 'mar', name: 'Mark' },
      { id: 'luk', name: 'Luke' },
      { id: 'jhn', name: 'John' },
      { id: 'act', name: 'Acts' },
      { id: 'rom', name: 'Romans' },
      { id: '1co', name: '1 Corinthians' },
      { id: '2co', name: '2 Corinthians' },
      { id: 'gal', name: 'Galatians' },
      { id: 'eph', name: 'Ephesians' },
      { id: 'php', name: 'Philippians' },
      { id: 'col', name: 'Colossians' },
      { id: '1th', name: '1 Thessalonians' },
      { id: '2th', name: '2 Thessalonians' },
      { id: '1ti', name: '1 Timothy' },
      { id: '2ti', name: '2 Timothy' },
      { id: 'tit', name: 'Titus' },
      { id: 'phm', name: 'Philemon' },
      { id: 'heb', name: 'Hebrews' },
      { id: 'jas', name: 'James' },
      { id: '1pe', name: '1 Peter' },
      { id: '2pe', name: '2 Peter' },
      { id: '1jn', name: '1 John' },
      { id: '2jn', name: '2 John' },
      { id: '3jn', name: '3 John' },
      { id: 'jud', name: 'Jude' },
      { id: 'rev', name: 'Revelation' }
    ],
    sampleText: {
      kjv: `<p><strong>Genesis 1</strong></p>
<p><strong>1</strong> In the beginning God created the heaven and the earth.</p>
<p><strong>2</strong> And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.</p>
<p><strong>3</strong> And God said, Let there be light: and there was light.</p>
<p><strong>4</strong> And God saw the light, that it was good: and God divided the light from the darkness.</p>
<p><strong>5</strong> And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.</p>
<p><strong>6</strong> And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.</p>
<p><strong>7</strong> And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.</p>
<p><strong>8</strong> And God called the firmament Heaven. And the evening and the morning were the second day.</p>
<p><strong>9</strong> And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.</p>
<p><strong>10</strong> And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.</p>`,
      nlt: `<p><strong>Genesis 1</strong></p>
<p><strong>1</strong> In the beginning God created the heavens and the earth.</p>
<p><strong>2</strong> The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.</p>
<p><strong>3</strong> Then God said, "Let there be light," and there was light.</p>
<p><strong>4</strong> And God saw that the light was good. Then he separated the light from the darkness.</p>
<p><strong>5</strong> God called the light "day" and the darkness "night." And evening passed and morning came, marking the first day.</p>
<p><strong>6</strong> Then God said, "Let there be a space between the waters, to separate the waters of the heavens from the waters of the earth."</p>
<p><strong>7</strong> And that is what happened. God made this space to separate the waters of the earth from the waters of the heavens.</p>
<p><strong>8</strong> God called the space "sky." And evening passed and morning came, marking the second day.</p>
<p><strong>9</strong> Then God said, "Let the waters beneath the sky flow together into one place, so dry ground may appear." And that is what happened.</p>
<p><strong>10</strong> God called the dry ground "land" and the waters "seas." And God saw that it was good.</p>`
    }
  }), []);

  // Generate sample text for different chapters
  const getSampleTextForChapter = useCallback((bookName, chapterNum) => {
    const verses = [];
    for (let i = 1; i <= 20; i++) {
      verses.push(`<p data-verse="${i}"><strong>${i}</strong> This is verse ${i} of ${bookName} chapter ${chapterNum}. The Bible contains many wonderful stories and teachings that guide us in our daily lives. Each verse reveals God's love and wisdom for His people throughout history. Reading the Bible helps us grow closer to God and understand His plan for us. May these words bring comfort, guidance, and inspiration to your heart.</p>`);
    }
    
    const chapterText = {
      kjv: `<p><strong>${bookName} ${chapterNum}</strong></p>${verses.join('')}`,
      nlt: `<p><strong>${bookName} ${chapterNum}</strong></p>${verses.join('')}`
    };
    return chapterText;
  }, []);

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
    if (newVerse >= 1 && newVerse <= 20) {
      // Scroll to the specific verse
      const verseElement = document.querySelector(`[data-verse="${newVerse}"]`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
          setUseFallback(false);
        } else {
          throw new Error('No books returned from API');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        console.log('Switching to fallback mode');
        setUseFallback(true);
        setBooks(fallbackContentMemo().books);
        setBook(fallbackContentMemo().books[0].id);
        // Set initial chapter to 1
        setChapter('1');
        // Initial text will be set by the fetchPassages effect
      }
    }
    fetchBooks();
  }, [makeRequest, fallbackContentMemo]);

  // Fetch chapters when book changes
  useEffect(() => {
    if (!book) return;
    
    if (useFallback) {
      // Use sample chapters for fallback mode
      const sampleChapters = Array.from({ length: 50 }, (_, i) => ({
        id: `chapter-${i + 1}`,
        number: (i + 1).toString()
      }));
      setChapters(sampleChapters);
      if (sampleChapters.length > 0) {
        setChapter(sampleChapters[0].number);
      }
      return;
    }
    
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
  }, [book, useFallback, makeRequest]);

  // Fetch passages when book or chapter changes
  useEffect(() => {
    if (!book || !chapter) return;
    
    if (useFallback) {
      // Use sample text for fallback mode
      const currentBookName = books.find(b => b.id === book)?.name || 'Unknown Book';
      const sampleText = getSampleTextForChapter(currentBookName, chapter);
      setKjvText(sampleText.kjv);
      setNltText(sampleText.nlt);
      setLoading(false);
      return;
    }
    
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
  }, [book, chapter, useFallback, makeRequest, books, getSampleTextForChapter]);

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
        
        {/* Verse Navigation */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: '600' }}>Verse:</label>
            <select 
              onChange={e => navigateToVerse(parseInt(e.target.value))} 
              style={{ 
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                minWidth: '80px'
              }}
            >
              <option value="">Select Verse</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          {/* Verse Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
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
              ⬇️ Last Verse
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