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