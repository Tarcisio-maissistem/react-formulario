import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDjYA3bSzB_g6OOnujjzwTjEmklYr2g6jY",
    authDomain: "autenticacao-fe353.firebaseapp.com",
    databaseURL: "https://autenticacao-fe353.firebaseio.com",
    projectId: "autenticacao-fe353",
    storageBucket: "autenticacao-fe353.appspot.com",
    messagingSenderId: "999667879162",
    appId: "1:999667879162:web:e1437a920627a0f61d8d43",
    measurementId: "G-LMGFDQN4CH"
};
// Initialize Firebase
const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();