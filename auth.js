  // Your web app's Firebase configuration
  var firebaseConfig = {
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

    const auth = firebase.auth();

function signIn(){
		
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    auth.onAuthStateChanged(function(user){
        if(user){
            window.location.href = "home.html";   
        }
    });
}

function signUp(){
    
    var name = document.getElementById("name");
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
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
    window.location.href = "main.html";
}

function isLoggedIn(){
    auth.onAuthStateChanged(function(user){
        if(user==null){    
            window.location.href = "main.html";
        }
    });
}

function getUser(){
    console.log(user.uid);
    return user;
}