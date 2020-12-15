let did = window.location.href.split('/')[4];
var color;
auth.onAuthStateChanged(async function(user){
    if(user){
        uid = user.uid;
        uname = await getUsernameByUid(uid);
        loadDList();
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

async function loadDList(){
    let desksList = [];
    await database.ref("users/"+uid+"/desksList").once('value',function(snap){
        snap.forEach(function(child){
            console.log(child.val());
            desksList.push(child.val());
        })
    });
    $('#dList').empty();
    for(let i=0;i<desksList.length;i++){
        let htmlMessage = "";
        htmlMessage += '<span onclick="location.href=\'' + desksList[i] + '\'\">';
        htmlMessage += await getDeskNameByDid(desksList[i]) + '</span>';
        $('#dList').append(htmlMessage);
    }
}

async function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    await database.ref('desks/'+did).once('value',async function(snap){
        let snapInfo = snap.val();
        $(document).ready(async function () {
            let deskInfo = '<div>';
            let deskImage = '<img style="height:450px;" src='+ snapInfo.deskImage + '/>';
            let deskName = '<p>'+ snapInfo.deskName + '</p>';
            let desciption = '<p>'+ snapInfo.description + '</p>';
            let owner = '<p>Owner: '+ await getUsernameByUid(snapInfo.owner) + '</p>';
            let followers = '<p>Followers: '+ snapInfo.followers + '</p>';
            let rating = '<p>Rating: '+ snapInfo.rating + '</p>';
            let likes = '<p>Likes: '+ snapInfo.likes + '</p>';
            let dislikes = '<p>Dislikes: '+ snapInfo.dislikes + '</p>';
            deskInfo = deskInfo + deskImage + desciption + '<hr/>' + owner + '<hr/>' + followers + '<hr/>' + rating + '<hr/>' + likes + '<hr/>' + dislikes;
            deskInfo = deskInfo + '</div>';
            $('#deskInfo').empty();
            $('#deskInfo').append(deskInfo);
            $('#dName').empty();
            $('#dName').append(deskName);
        });
    });
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
   $('p').css('color',color);
}
  
database.ref('desks/'+did+'/messages/').on("child_added",async function(snapshot){
    let messageContainer = document.getElementById('messageContainer');
    console.log('why i m not called');
    console.log(await snapshot.val());
    let htmlMessage = "";
    getRandomColor();
    htmlMessage += '<p>' + '<span style="color:'+ color + ';">' + snapshot.val().sender + ': </span>' + snapshot.val().message + "</p>";
    console.log('I am ' +htmlMessage);
    messageContainer.innerHTML += htmlMessage;
});