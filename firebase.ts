import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCxXVrO3echNOBypFbxC3-sKZBJukhYzCM',
  authDomain: 'cashbook-77969.firebaseapp.com',
  projectId: 'cashbook-77969',
  storageBucket: 'cashbook-77969.appspot.com',
  messagingSenderId: '93885992795',
  appId: '1:93885992795:web:85cc6f261b03bab1f8d47e',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
