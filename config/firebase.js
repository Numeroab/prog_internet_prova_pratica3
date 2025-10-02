const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: "AIzaSyB3-a53XkMzy447QEbNKCtU2HhBzpoDnaI",
  authDomain: "apirestformulario.firebaseapp.com",
  projectId: "apirestformulario",
  storageBucket: "apirestformulario.firebasestorage.app",
  messagingSenderId: "446486715884",
  appId: "1:446486715884:web:5462a4281f8d3bf162f4c9",
  measurementId: "G-LV8E0GEBYD"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = { db, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where };

