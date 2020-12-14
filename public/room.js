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

// async function loadMessages(){
//     let htmlMessage = "";
//     await database.ref('desks/'+did+'/messages/').once('value',async function(snapshot){
//         snapshot.forEach(async function(child){
            
//         })
//     });
//     messageContainer.innerHTML += htmlMessage;
// }

async function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    await database.ref('desks/'+did).once('value',async function(snap){
        let snapInfo = snap.val();
        $(document).ready(async function () {
            var deskInfo = '<div>';
            var deskImage = '<img src='+ snapInfo.deskImage + '/>';
            var deskName = '<p>Name: '+ snapInfo.deskName + '</p>';
            var desciption = '<p>Description: '+ snapInfo.description + '</p>';
            var owner = '<p>Owner: '+ await getUsernameByUid(snapInfo.owner) + '</p>';
            var followers = '<p>Followers: '+ snapInfo.followers + '</p>';
            var likes = '<p>Likes: '+ snapInfo.likes + '</p>';
            deskInfo = deskInfo + deskImage + deskName + desciption + owner + followers + likes;
            deskInfo = deskInfo + '</div>';
            $('#deskInfo').empty();
            $('#deskInfo').append(deskInfo);
        });
    });
    let desksList = [];
    await database.ref("users/"+uid+"/desksList").once('value',function(snap){
        snap.forEach(function(child){
            console.log(child.val());
            desksList.push(child.val());
        })
    });
    let htmlMessage = "";
    for(let i=0;i<desksList.length;i++){
        htmlMessage += '<div class="flip-card" style="float:left;" onclick="location.href=' + desksList[i] + '\'\">';
        htmlMessage += await getDeskNameByDid(desksList[i]) + '</div>';
    }
    $('#deskInfo').append(htmlMessage);
}
  
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

database.ref('desks/'+did+'/messages/').on("child_added",async function(snapshot){
    let messageContainer = document.getElementById('messageContainer');
    console.log('why i m not called');
    console.log(await snapshot.val());
    let htmlMessage = "";
    htmlMessage += "<p>" + snapshot.val().sender + ":" + snapshot.val().message + "</p>";
    htmlMessage += "<hr/>";
    console.log('I am ' +htmlMessage);
    messageContainer.innerHTML += htmlMessage;
});