import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAg2sn35a87F7hRnqOEuVgRdUgY8SZu1fE',
  authDomain: 'base-wrestling-app.firebaseapp.com',
  projectId: 'base-wrestling-app',
  storageBucket: 'base-wrestling-app.firebasestorage.app',
  messagingSenderId: '368548684923',
  appId: '1:368548684923:web:0fc54795d1f375b0e6eede',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
