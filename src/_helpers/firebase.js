import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyAs8ckMaLNyqSVJ8NHBtZiVd_547hDtTyE",
    authDomain: "mais-sistem.firebaseapp.com",
    databaseURL: "https://mais-sistem.firebaseio.com",
    projectId: "mais-sistem",
    storageBucket: "mais-sistem.appspot.com",
    messagingSenderId: "1000197459432",
    appId: "1:1000197459432:web:eaddd9a3be31255745285d"
};
firebase.initializeApp(firebaseConfig);

export default firebase


// import firebase from 'firebase/app';
// import 'firebase/database';

// const firebaseConfig = {
//     apiKey: "AIzaSyDjYA3bSzB_g6OOnujjzwTjEmklYr2g6jY",
//     authDomain: "autenticacao-fe353.firebaseapp.com",
//     databaseURL: "https://autenticacao-fe353.firebaseio.com",
//     projectId: "autenticacao-fe353",
//     storageBucket: "autenticacao-fe353.appspot.com",
//     messagingSenderId: "999667879162",
//     appId: "1:999667879162:web:e1437a920627a0f61d8d43",
//     measurementId: "G-LMGFDQN4CH"
// };
// // Initialize Firebase
// const fireDb = firebase.initializeApp(firebaseConfig);
// export default fireDb.database().ref();