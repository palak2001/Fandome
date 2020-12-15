var uid;
var uname;
var upair = {};

auth.onAuthStateChanged(async function(user){
    
    if(user){
        uid = user.uid;
        uname = await getUsernameByUid(uid);
        console.log("Logged in user id: " + uid);
        console.log("Logged in username: " + uname);
        upair[uid] = uname;
        console.log(window.location.href);
        getMyDesks();
        getAllDesks();
    }
    else{
        window.location.href = "index.html";
    }
});
    
async function createDesk(){
    
    let deskName = document.getElementById("deskName").value;
    let deskImage = document.getElementById("deskImage").files[0];
    let storageref = firebase.storage().ref('desks/' + deskName);
    let uploadTask = storageref.put(deskImage);
    await uploadTask.on('state_changed', function(snapshot){
    }, function(error){
    console.error(error);
    }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
    });
    });
    let imgurl;
    let pathReference = firebase.storage().ref('desks/'+ deskName);
    await pathReference.getDownloadURL().then(function(url) {
    imgurl =  url;});

    let description = document.getElementById("deskDescription").value;
    let deskRef = await database.ref().child('desks').push();

    let desk = {
        "deskName" : deskName,
        "did" : deskRef.key,
        "deskImage" : imgurl,
        "owner" : uid,
        "description" : description,
        "userList" : [uname],
        "followers" : 1,
        "likes" : 0,
        "dislikes" : 0,
        "rating" : 0
    };
    await deskRef.set(desk);

    await database.ref("users/" + uid + "/desksList").push().set(deskRef.key);
    window.location.href = "desk.html";
}

async function getDidByDeskName(deskName){

    let did;
    console.log(deskName);
    await database.ref('desks/').once('value',function(snapshot){
        snapshot.forEach(function(child){
            let childInfo = child.val();
            if(childInfo.deskName==deskName){
                did = childInfo.did;
            }
        });
    });
    return did;
}

async function getDeskNameByDid(did){

    let deskName;
    console.log(did);
    await database.ref('desks/' + did).once('value' ,function(child){
        console.log(child.val());
        let childInfo = child.val();
        deskName = childInfo.deskName;
    });
    return deskName;
}

async function findDesk(){

    let deskName = document.getElementById("findDesk").value;
    let did = await getDidByDeskName(deskName);
    let deskInfo = document.getElementById("deskInfo");
    //$(document).ready(function (){$('#deskInfo').empty();});
    let nodeRef = document.createElement("button");
    if(did==null){
        nodeRef.innerHTML = 'Create';
        nodeRef.setAttribute("data-toggle","modal");
        nodeRef.setAttribute("data-target",document.getElementById("createDesk"));
    }
    else if(isJoined()){
        nodeRef.innerHTML = 'Open';
        nodeRef.onclick = "room/" + did;
    }
    else{
        nodeRef.innerHTML = 'Join';
        console.log(nodeRef);
        nodeRef.addEventListener("click",function () {joinDesk(did)});
    }
    //deskInfo.append(node);
    deskInfo.appendChild(nodeRef);
}

async function isJoined(did){
    let res = false;
    await database.ref("users/" + uid + "/desksList").once('value',function(snap){
        snap.forEach(function(child){
            console.log(child.val());
            if(child.val()==did){
                res = true;
            }
        })
    });
    return res;
}

async function joinDesk(did){
    await database.ref("desks/" + did + "/userList").push().set(uname);
    await database.ref("desks/" + did).once('value',function(snap){
        let followers = snap.followers;
        snap.followers = followers+1;
    });
    console.log("Joined the Desk");
    await database.ref("users/" + uid + "/desksList").push().set(did);
}

async function getAllDesks(){

    //get desks list from database
    console.log("getAllDesks() function is called")
    let desksList=[];
    await database.ref("desks").orderByChild("followers").once('value',function(snap){
        snap.forEach(function(child){
            desksList.push(child.val().did);
        })
    });
    console.log(desksList);
    $(document).ready(function (){$('#allDesks').empty();});
    getDesks = document.getElementById("allDesks");
    for( let i =0; i<desksList.length; i++){
        await database.ref('desks/' + desksList[i]).once('value' ,function(child){
            console.log(child.val());
            let childInfo = child.val();
        
            $(document).ready(function () {
                //$('#myDesks').empty();
                let container = '<div class="flip-card" style="float:left;" onclick="location.href= \'room/' + desksList[i] + '\'\">';
                let subContainer = '<div class="flip-card-inner">';
                let front = '<div class="flip-card-front">';
                let image = '<img src='+ childInfo.deskImage + 'alt="Avatar" class="card-img">';
                front = front + image + '</div>';
                let back = '<div class="flip-card-back"> ';
                let name = '<h5>' + childInfo.deskName + '</h5>';
                let description = '<p id="inline-para">' + childInfo.description + '</p>';
                let followers = '<p id="inline-para">Followers : ' + childInfo.followers + '</p>';
                let rating = '<p id="inline-para">Rating : ' + childInfo.rating + '</p>';
                let likes = '<p id="inline-para">Likes : ' + childInfo.likes + '</p>';
                let dislikes = '<p id="inline-para">Dislikes : ' + childInfo.dislikes + '</p>';
                back = back + name + description + followers + rating + likes + dislikes + '</div>';
                subContainer = subContainer + front + back + '</div>';
                container = container + subContainer + '</div>';
                $('#allDesks').append(container);
            });
        });
    }
}

async function getMyDesks(){

    //get desks list from database
    console.log("getMyDesks() function is called")
    let desksList=[];
    await database.ref("users/"+uid+"/desksList").once('value',function(snap){
        snap.forEach(function(child){
            console.log(child.val());
            desksList.push(child.val());
        })
    });
    console.log(desksList);
    $(document).ready(function (){$('#myDesks').empty();});
    getDesks = document.getElementById("myDesks");
    for( let i =0; i<desksList.length; i++){
        await database.ref('desks/' + desksList[i]).once('value' ,function(child){
            console.log(child.val());
            let childInfo = child.val();
        
            $(document).ready(function () {
                let container = '<div class="flip-card" style="float:left;" onclick="location.href= \'room/' + desksList[i] + '\'\">';
                let subContainer = '<div class="flip-card-inner">';
                let front = '<div class="flip-card-front">';
                let image = '<img src=' + childInfo.deskImage +'alt="Avatar" class="card-img">';
                front = front + image + '</div>';
                let back = '<div class="flip-card-back"> ';
                let name = '<h5>' + childInfo.deskName + '</h5>';
                let description = '<p id="inline-para">' + childInfo.description + '</p>';
                let followers = '<p id="inline-para">Followers : ' + childInfo.followers + '</p>';
                let rating = '<p id="inline-para">Rating : ' + childInfo.rating + '</p>';
                let likes = '<p id="inline-para">Likes : ' + childInfo.likes + '</p>';
                let dislikes = '<p id="inline-para">Dislikes : ' + childInfo.dislikes + '</p>';
                back = back + name + description + followers + rating + likes + dislikes + '</div>';
                subContainer = subContainer + front + back + '</div>';
                container = container + subContainer + '</div>';
                $('#myDesks').append(container);
            });
        });
    }
}