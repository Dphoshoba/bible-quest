// src/utils/bibleApi.js
import axios from 'axios';

const API_KEY = '7cb24dba2c294598484b896f6d6a6e65';


const BASE_URL = 'https://api.scripture.api.bible/v1';

export const fetchBooks = async (bibleId) => {
  const response = await axios.get(`${BASE_URL}/bibles/${bibleId}/books`, {
    headers: { 'api-key': API_KEY },
  });
  return response.data.data;
};

export const fetchChapters = async (bibleId, bookId) => {
  const response = await axios.get(`${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, {
    headers: { 'api-key': API_KEY },
  });
  return response.data.data;
};

export const fetchChapterText = async (bibleId, chapterId) => {
  const response = await axios.get(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}`, {
    headers: { 'api-key': API_KEY },
  });
  return response.data.data.content;
};
