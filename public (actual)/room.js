did = window.location.href.split('/')[4];
var color;
let username;
let uimage;
auth.onAuthStateChanged(async function(user){
    if(user){
        uid = user.uid;
        await database.ref("users/" + uid).once('value',function(snap){
            username = snap.val().username;
            uimage = snap.val().image;
        });
        loadDList();
    }
});

async function uploadImageMessage(image,did){
    var date = Date.now().toString();
    let storageref = firebase.storage().ref('messages/' + did + '/'+date);
    let uploadTask = storageref.put(image);
    await uploadTask.on('state_changed', async function(snapshot){
    }, async function(error){
        console.error(error);
        }, async function() {
            await uploadTask.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
                console.log('File available at', downloadURL);
                let imgurl;
                let pathReference = firebase.storage().ref('messages/' + did + '/'+date);
                await pathReference.getDownloadURL().then(function(url) {
                imgurl =  url;});
                await database.ref('desks/'+did+'/messages/').push().set({
                    'image': uimage,
                    'sender': username,
                    'messageDetails' : {
                        'type': 'image/gif',
                        'message' : imgurl
                    }
                });
            });
    });
}

async function sendText(){
    let message = document.getElementById('textMessage').value;
    let imageMessage = document.getElementById('imageMessage');
    console.log(message);
    console.log(imageMessage.files);
    if(message.length==0&&imageMessage.files.length==0){
        return false;
    }
    document.getElementById('textMessage').value = "";
    if(message.length>0){
        await database.ref('desks/'+did+'/messages/').push().set({
            'image': uimage,
            'sender': username,
            'messageDetails' : {
                'type': 'text/plain',
                'message' : message
            }
        });
    }
    console.log(imageMessage);
    if(imageMessage.files.length>0){
        await uploadImageMessage(imageMessage.files[0],did);
        removeElement(document.getElementById("imageMessage").files[0]);
    }
    return false;
}

async function loadDList(){
    let desksList = [];
    await database.ref("users/"+uid+"/desksList").once('value',function(snap){
        snap.forEach(function(child){
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

async function unfollow(){
    let followers;
    await database.ref('desks/' + did).once('value',function(snap){
        followers = snap.val().followers;
    });
    followers = followers-1;
    let key;
    await database.ref('desks/' + did + '/userList').once('value',async function(snap){
        await snap.forEach(function(child){
            if(child.val()==uid){
                key = child.key;
            }
        });
    });
    await database.ref('desks/' + did + '/userList').child(key).remove();
    await database.ref('desks/' + did).update({"followers":followers});
    await database.ref('users/'+ uid + '/desksList').once('value',async function(snap){
        await snap.forEach(function(child){
            if(child.val()==did){
                key = child.key;
            }
        });
    });
    await database.ref('users/' + uid + '/desksList').child(key).remove();
    window.location.href = "../desk.html";
}

async function like(){
    let likes;
    await database.ref('desks/' + did).once('value',function(snap){
        likes = snap.val().likes;
    });
    likes = likes+1;
    await database.ref('desks/' + did).update({"likes": likes});
}

async function dislike(){
    let dislikes;
    await database.ref('desks/' + did).once('value',function(snap){
        dislikes = snap.val().dislikes;
    });
    dislikes = dislikes+1;
    await database.ref('desks/' + did).update({"dislikes": dislikes});
}

async function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    await database.ref('desks/'+did).once('value',async function(snap){
        let snapInfo = snap.val();
        let deskInfo = '<div>';
        let deskImage = '<img style="height:450px; object-fit: cover;" src='+ snapInfo.deskImage + '/>';
        let deskName = '<p>'+ snapInfo.deskName + '</p>';
        let desciption = '<p>'+ snapInfo.description + '</p>';
        let owner = '<p>Owner: '+ await getUsernameByUid(snapInfo.owner) + '</p>';
        let followers = '<p>Followers: '+ snapInfo.followers + '</p>';
        let rating = '<p>Rating: '+ snapInfo.rating + '</p>';
        let likes = '<p>Likes: '+ snapInfo.likes + '</p>';
        let dislikes = '<p>Dislikes: '+ snapInfo.dislikes + '</p>';
        deskInfo = deskInfo + deskImage + desciption + '<hr/>' + owner + '<hr/>' + followers + '<hr/>' + rating + '<hr/>' + likes + '<hr/>' + dislikes;
        deskInfo = deskInfo + '</div>';
        $('#deskInfoo').empty();
        $('#deskInfoo').append(deskInfo);
        $('#dName').empty();
        $('#dName').append(deskName);
    });
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function getRandomColor() {
    var letters = '1234567'.split('');
    color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 7)];
    }
}
  
database.ref('desks/'+did+'/messages/').on("child_added",async function(snapshot){
    let messageContainer = document.getElementById('messageContainer');
    let htmlMessage = document.createElement('p');
    getRandomColor();
    let userImage = new Image();
    userImage.style.display = 'inline-block';
    userImage.src = snapshot.val().image;
    let userName = document.createElement('span');
    userName.style.color = color;
    userName.innerHTML = snapshot.val().sender;
    htmlMessage.appendChild(userImage);
    htmlMessage.appendChild(userName);
    if(snapshot.val().messageDetails.type=="text/plain"){
        let textMessage = document.createElement('span');
        textMessage.innerHTML = ": "+snapshot.val().messageDetails.message;
        htmlMessage.appendChild(textMessage);
    }
    else{
        let imageMessage = new Image();
        imageMessage.src = snapshot.val().messageDetails.message;
        imageMessage.className = 'message';
        let div = document.createElement('div');
        div.append(imageMessage);
        htmlMessage.append(div);
    }
    messageContainer.append(htmlMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

function removeElement(ele) {
    ele.parentNode.removeChild(ele);
}