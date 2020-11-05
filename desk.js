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
        }
        else{
            window.location.href = "main.html";
        }
    });
    
async function createDesk(){
    
    var deskName = document.getElementById("deskName").value;
    var description = document.getElementById("deskDescription").value;
    var roomRef = await database.ref().child('rooms').push();
    var deskRef = await database.ref().child('desks').push();
    var desk = {
        "deskName" : deskName,
        "did" : deskRef.key,
        "owner" : uid,
        "description" : description,
        "roomId" : roomRef.key,
        "userList" : upair,
        "followers" : 1,
        "likes" : 0,
        "dislikes" : 0,
        "rating" : 0
    };
    deskRef.set(desk);
    var room = {
        "rid" : roomRef.key
    }
    roomRef.set(room);
}

async function getDidByDeskName(deskName){
    var did;
    console.log(deskName);
    await database.ref('desks/').once('value',function(snapshot) {
        snapshot.forEach(function(child){
            var l=[];
            child.forEach(function(subChild){
               l.push(subChild.val()); 
            });
            if(l[5]==deskName){
                did =  l[1];
            }
        });
    });
    return did;
}

async function joinDesk(){
    var deskName = document.getElementById("joinDeskName").value;
    var did = await getDidByDeskName(deskName);
    console.log("did : "+ did);
    database.ref("desks/" + did + "/userList").push().set(upair);
}


async function getAllDesks(){
    console.log("getAllDesks() function is called")
    var desksList=[];
    await database.ref("desks").once('value',function(snap){
        snap.forEach(function(child){
            child.forEach(function(subChild){
                if(subChild.key=="deskName"){
                    desksList.push(subChild.val());
                }
            });
        })
    });
    getDesks = document.getElementById("allDesks");
    for( var i =0; i<desksList.length; i++){
        var singleDeskNode = document.createElement("li");
        var singleDeskNodeContent = document.createElement("a");
        singleDeskNodeContent.textContent = desksList[i];
        singleDeskNodeContent.href = await getDidByDeskName(desksList[i]);
        singleDeskNode.appendChild(singleDeskNodeContent);
        getDesks.append(singleDeskNode);
    }
}

/*
async function findDesk(){
    var deskName = document.getElementById("findDesk").value;
    var did = getDidByDeskName(deskName);
    var deskInfo = document.getElementById("userInfo");
    var node = document.createElement("a");
    node.textContent = username;
    node.href = uid;
    console.log(node);
    userInfo.append(node);
}

function getUidByUsername(username)
{
    var email;
    var name;
    var uid;
    firebase.database().ref("users").on('value', function(snap){
        snap.forEach(function(child){
            var l=[];
            child.forEach(function(subChild){
                console.log(subChild.key);
                l.push(subChild.val());
            });
            if(l[2]==username){
                email = l[0];
                name = l[1];
                uid = child.key;
           }
       });
     });
    console.log(email);
    console.log(name);
    console.log(uid);
    return uid;
}*/