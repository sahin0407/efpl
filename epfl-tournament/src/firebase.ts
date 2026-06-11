import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCIjhWfJk5lvEkHECWEJdd2A7IckbHCy_0",
  authDomain: "efpl-mobile.firebaseapp.com",
  databaseURL: "https://efpl-mobile-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "efpl-mobile",
  storageBucket: "efpl-mobile.firebasestorage.app",
  messagingSenderId: "639730319565",
  appId: "1:639730319565:web:e45eb2ab6972e2af972984"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
