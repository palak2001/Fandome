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

async function signIn(){	
    let email = document.getElementById("signinemail");
    let password = document.getElementById("signinpassword");
    
    const promise = await auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    await auth.onAuthStateChanged(function(user){
        if(user){
            window.location.href = "desk.html";   
        }
    });
}

async function signUp(){
    let name = document.getElementById("name");
    let image = document.getElementById("image").files[0];
    let storageref = firebase.storage().ref('gallery/' + name.value);
    let uploadTask = storageref.put(image);
    await uploadTask.on('state_changed', async function(snapshot){
    }, async function(error){
    console.error(error);
    }, async function() {
    await uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
    });
    });
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    
    await auth.createUserWithEmailAndPassword(email.value, password.value).catch(function(error){
        window.alert("Error: "+ error.message);
    });
    
    let imgurl;
    let pathReference = firebase.storage().ref('gallery/'+ name.value);
    await pathReference.getDownloadURL().then(function(url) {
    imgurl =  url;});
    await auth.onAuthStateChanged(async function(user){
        if(user){
            user.sendEmailVerification().then(async function(){
                alert("verify your email id though mail sent to you and then click ok to continue.");
                await user.reload();
                if(user.emailVerified){
                await database.ref('users/' + user.uid).set({
                    image: imgurl,
                    name: name.value,
                    username: username.value,
                    email: user.email
                });
                window.location.href = "desk.html"; 
                console.log(user.emailVerified);  
                }
                else{
                    console.log(user.emailVerified);  
                    user.delete();
                }
            }).catch(function(error){console.log(error);});
        }
    });
}

async function signOut(){

    await auth.signOut();
    alert("Signed Out");
    window.location.href = "index.html";
}

async function isLoggedIn(){
    await auth.onAuthStateChanged(function(user){
        if(user==null){    
            window.location.href = "index.html";
        }
    });
}