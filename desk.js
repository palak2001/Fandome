let uid;
let uname;
let upair = {};

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
    
    let deskName = document.getElementById("deskName").value;
    let description = document.getElementById("deskDescription").value;
    let roomRef = await database.ref().child('rooms').push();
    let deskRef = await database.ref().child('desks').push();

    let desk = {
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

    let room = {
        "rid" : roomRef.key
    }
    roomRef.set(room);
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

async function joinDesk(){

    let deskName = document.getElementById("joinDeskName").value;
    let did = await getDidByDeskName(deskName);
    await database.ref("desks/" + did + "/userList").push().set(upair);
}


async function getAllDesks(){

    //get desks list from database
    console.log("getAllDesks() function is called")
    let desksList=[];
    await database.ref("desks").once('value',function(snap){
        snap.forEach(function(child){
            let childInfo = child.val();
            desksList.push(childInfo.deskName);
        })
    });

    //fill desks list in DOM
    getDesks = document.getElementById("allDesks");
    for( let i =0; i<desksList.length; i++){
        let singleDeskNode = document.createElement("li");
        let singleDeskNodeContent = document.createElement("a");
        singleDeskNodeContent.textContent = desksList[i];
        singleDeskNodeContent.href = await getDidByDeskName(desksList[i]);
        singleDeskNode.appendChild(singleDeskNodeContent);
        getDesks.append(singleDeskNode);
    }
}

/*
async function findDesk(){
    let deskName = document.getElementById("findDesk").value;
    let did = getDidByDeskName(deskName);
    let deskInfo = document.getElementById("userInfo");
    let node = document.createElement("a");
    node.textContent = username;
    node.href = uid;
    console.log(node);
    userInfo.append(node);
}

function getUidByUsername(username)
{
    let email;
    let name;
    let uid;
    firebase.database().ref("users").on('value', function(snap){
        snap.forEach(function(child){
            let l=[];
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