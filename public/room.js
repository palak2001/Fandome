let did = window.location.href.split('/')[4];

auth.onAuthStateChanged(async function(user){
    if(user){
        uid = user.uid;
        uname = await getUsernameByUid(uid);
    }
});

async function sendMessage(){
    let message = document.getElementById('message').value;
    console.log(message);
    await database.ref('desks/'+did+'/messages/').push().set({
        'sender' : uname,
        'message' : message
    });
    return false;
}

async function loadMessages(){
    let htmlMessage = "";
    await database.ref('desks/'+did+'/messages/').once('value',async function(snapshot){
        snapshot.forEach(function(child){
            htmlMessage += "<li>" + child.val().sender + ":" + child.val().message + "</li>";
        })
    });
    messageContainer.innerHTML += htmlMessage;
}

database.ref('desks/'+did+'/messages/').on("child_added",async function(snapshot){
    let messageContainer = document.getElementById('messageContainer');
    console.log('why i m not called');
    console.log(await snapshot.val());
    let htmlMessage = "";
    htmlMessage += "<li>" + snapshot.val().sender + ":" + snapshot.val().message + "</li>";
    console.log('I am ' +htmlMessage);
    messageContainer.innerHTML += htmlMessage;
});