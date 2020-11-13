// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBx2BGtFt1KwtL0F-sYSoaJMXO8HcbAkxQ",
    authDomain: "fandome.firebaseapp.com",
    databaseURL: "https://fandome.firebaseio.com",
    projectId: "fandome",
    storageBucket: "fandome.appspot.com",
    messagingSenderId: "511056563788",
    appId: "1:511056563788:web:11b750a29b736b3b572ee9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

//Get a reference to firebase authentication service
const auth = firebase.auth();

function signIn(){
		
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    auth.onAuthStateChanged(function(user){
        if(user){
            window.location.href = "home.html";   
        }
    });
}

function signUp(){
    
    let name = document.getElementById("name");
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    auth.onAuthStateChanged(function(user){
        if(user){
            database.ref('users/' + user.uid).set({
                name: name.value,
                username: username.value,
                email: user.email
              });
            window.location.href = "home.html";   
        }
    });
}

function signOut(){

    auth.signOut();
    alert("Signed Out");
    window.location.href = "index.html";
}

function isLoggedIn(){
    auth.onAuthStateChanged(function(user){
        if(user==null){    
            window.location.href = "index.html";
        }
    });
}