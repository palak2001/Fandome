
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDXQpmWx2Ic2Pj3rPxtm5FP8ekqIpDl4rU",
    authDomain: "gossipgrowl-1ba6a.firebaseapp.com",
    databaseURL: "https://gossipgrowl-1ba6a.firebaseio.com",
    projectId: "gossipgrowl-1ba6a",
    storageBucket: "gossipgrowl-1ba6a.appspot.com",
    messagingSenderId: "508066823980",
    appId: "1:508066823980:web:744d150627bffa77427689"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

function signIn(){
		
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    
    alert("Signed In" + email);
}

function signUp(){
		
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    
    alert("Signed Up");
}

function signOut()
{
    auth.signOut();
    alert("Signed Out");
}
