import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from './config.js';

const KJV_ID = 'de4e12af7f28f599-01';
const NLT_ID = '65eec8e0b60e656b-01';

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

  // Helper function to format passage reference
  const formatPassageRef = (bookId, chapterNum) => {
    if (!bookId || !chapterNum) return null;
    // Skip the 'intro' chapter
    if (chapterNum === 'intro') return null;
    return `${bookId}.${chapterNum}`;
  };

  // Helper function to make API requests
  async function makeRequest(endpoint, body) {
    console.log('Making request to:', endpoint);
    console.log('Request body:', body);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  }

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
        setError('Failed to load books: ' + err.message);
      }
    }
    fetchBooks();
  }, []);

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
          // Filter out the 'intro' chapter and get valid chapter numbers
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
  }, [book]);

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
  }, [book, chapter]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Bible (KJV & NLT)</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <label>
          Book:
          <select 
            value={book} 
            onChange={e => setBook(e.target.value)} 
            style={{ marginLeft: 8 }}
            disabled={!books.length}
          >
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 16 }}>
          Chapter:
          <select 
            value={chapter} 
            onChange={e => setChapter(e.target.value)} 
            style={{ marginLeft: 8 }}
            disabled={!chapters.length}
          >
            {chapters.map(c => (
              <option key={c.id} value={c.number}>
                {c.number}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1, background: '#f3f3f3', padding: 16, borderRadius: 8 }}>
            <h3>KJV</h3>
            {kjvError ? (
              <div style={{ color: 'red' }}>{kjvError}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: kjvText }} />
            )}
          </div>
          <div style={{ flex: 1, background: '#e3f2fd', padding: 16, borderRadius: 8 }}>
            <h3>NLT</h3>
            {nltError ? (
              <div style={{ color: 'red' }}>{nltError}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: nltText }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BiblePage; 