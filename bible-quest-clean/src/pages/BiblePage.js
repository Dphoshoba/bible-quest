// src/components/BiblePage.js
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';

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
  const [kjvError, setKjvError] = useState('');
  const [nltError, setNltError] = useState('');

  const formatPassageRef = (bookId, chapterNum) => {
    if (!bookId || !chapterNum || chapterNum === 'intro') return null;
    return `${bookId}.${chapterNum}`;
  };

  async function makeRequest(endpoint, body) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status} ${response.statusText}: ${errorText}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await makeRequest(API_ENDPOINTS.bibleBooks, { bibleId: KJV_ID });
        if (data.data?.length) {
          setBooks(data.data);
          setBook(data.data[0].id);
        } else {
          throw new Error('No books returned.');
        }
      } catch (err) {
        setError('Failed to load books: ' + err.message);
      }
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!book) return;
    async function fetchChapters() {
      try {
        const data = await makeRequest(API_ENDPOINTS.bibleChapters, { bibleId: KJV_ID, bookId: book });
        const validChapters = data.data.filter(c => c.number !== 'intro');
        setChapters(validChapters);
        if (validChapters.length > 0) {
          setChapter(validChapters[0].number);
        }
      } catch (err) {
        setError('Failed to load chapters: ' + err.message);
      }
    }
    fetchChapters();
  }, [book]);

  useEffect(() => {
    if (!book || !chapter) return;
    const fetchPassages = async () => {
      setLoading(true);
      setKjvError('');
      setNltError('');
      setError('');
      const passage = formatPassageRef(book, chapter);
      if (!passage) return setLoading(false);

      try {
        const kjv = await makeRequest(API_ENDPOINTS.bible, { bibleId: KJV_ID, passage });
        setKjvText(kjv.data?.content || '');
      } catch (err) {
        setKjvError(err.message);
      }

      try {
        const nlt = await makeRequest(API_ENDPOINTS.bible, { bibleId: NLT_ID, passage });
        setNltText(nlt.data?.content || '');
      } catch (err) {
        setNltError(err.message);
      }

      setLoading(false);
    };
    fetchPassages();
  }, [book, chapter]);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Bible Quest (KJV & NLT)</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <label>Book:
          <select value={book} onChange={e => setBook(e.target.value)} disabled={!books.length} style={{ marginLeft: 8 }}>
            {books.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>

        <label style={{ marginLeft: 24 }}>Chapter:
          <select value={chapter} onChange={e => setChapter(e.target.value)} disabled={!chapters.length} style={{ marginLeft: 8 }}>
            {chapters.map(c => <option key={c.id} value={c.number}>{c.number}</option>)}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading passage...</p>
      ) : (
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, background: '#f1f1f1', padding: 16, borderRadius: 8 }}>
            <h3>KJV</h3>
            {kjvError ? <div style={{ color: 'red' }}>{kjvError}</div> : <div dangerouslySetInnerHTML={{ __html: kjvText }} />}
          </div>
          <div style={{ flex: 1, background: '#e3f2fd', padding: 16, borderRadius: 8 }}>
            <h3>NLT</h3>
            {nltError ? <div style={{ color: 'red' }}>{nltError}</div> : <div dangerouslySetInnerHTML={{ __html: nltText }} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default BiblePage;



