import React from 'react';

export const isPremiumUser = false;

export const characters = [
  { id: 'david', name: 'David', avatar: '/avatars/david.jpg', premium: false },
  { id: 'esther', name: 'Esther', avatar: '/avatars/esther.jpg', premium: false },
  { id: 'samson', name: 'Samson', avatar: '/avatars/samson.png', premium: true },
  { id: 'joseph', name: 'Joseph', avatar: '/avatars/joseph.jpg', premium: true },
  { id: 'mary-joseph', name: 'Mary & Joseph', avatar: '/avatars/mary-joseph.png', premium: true },
  { id: 'paul', name: 'Paul', avatar: '/avatars/paul.png', premium: true },
  { id: 'jesus', name: 'Jesus', avatar: '/avatars/jesus.jpg', premium: true },
  { id: 'adam-eve', name: 'Adam & Eve', avatar: '/avatars/adam-eve.jpg', premium: true },
  { id: 'noah', name: 'Noah', avatar: '/avatars/noah.png', premium: true },
  { id: 'abraham', name: 'Abraham', avatar: '/avatars/abraham.jpg', premium: true },
  { id: 'samuel', name: 'Samuel', avatar: '/avatars/samuel.png', premium: true },
  { id: 'naomi', name: 'Naomi', avatar: '/avatars/naomi.png', premium: true },
  { id: 'daniel', name: 'Daniel', avatar: '/avatars/daniel.jpg', premium: true },
  { id: 'cain-abel', name: 'Cain & Abel', avatar: '/avatars/cain-abel.jpg', premium: true }
];

export const CharacterContext = React.createContext({
  characters: characters,
  isPremiumUser: isPremiumUser
}); 