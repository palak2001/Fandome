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
        if(window.location == "https://fandome.web.app/home.html"){
            getMyDesks();
        }
        if(window.location.href == "https://fandome.web.app/desk.html"){
            getAllDesks();
        }
    }
    else{
        window.location.href = "index.html";
    }
});
    
async function createDesk(){
    
    let deskName = document.getElementById("deskName").value;
    let description = document.getElementById("deskDescription").value;
    let deskRef = await database.ref().child('desks').push();

    let desk = {
        "deskName" : deskName,
        "did" : deskRef.key,
        "owner" : uid,
        "description" : description,
        "userList" : [uname],
        "followers" : 1,
        "likes" : 0,
        "dislikes" : 0,
        "rating" : 0
    };
    deskRef.set(desk);

    await database.ref("users/" + uid + "/desksList").push().set(deskRef.key);
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
    let node = document.createTextNode(deskName);
    let nodeRef = document.createElement("button");
    if(did==null){
        nodeRef.innerHTML = 'Create Desk';
        nodeRef.onclick = "Create desk popup";
    }
    else{
        nodeRef.innerHTML = 'Join Desk';
        console.log(nodeRef);
        nodeRef.addEventListener("click",function () {joinDesk(did)});
    }
    deskInfo.append(node);
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
    if(await isJoined(did))return;
    await database.ref("desks/" + did + "/userList").push().set(uname);
    console.log("Joined the Desk");
    await database.ref("users/" + uid + "/desksList").push().set(did);
}

async function getAllDesks(){

    //get desks list from database
    console.log("getAllDesks() function is called")
    let desksList=[];
    await database.ref("desks").orderByChild("followers").once('value',function(snap){
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
        singleDeskNodeContent.href = ("room/"+await getDidByDeskName(desksList[i]));
        singleDeskNode.appendChild(singleDeskNodeContent);
        getDesks.append(singleDeskNode);
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
    //fill desks list in DOM
    getDesks = document.getElementById("myDesks");
    for( let i =0; i<desksList.length; i++){
        let singleDeskNode = document.createElement("li");
        let singleDeskNodeContent = document.createElement("a");
        singleDeskNodeContent.textContent = await getDeskNameByDid(desksList[i]);
        singleDeskNodeContent.href =  ("room/" + desksList[i]);
        singleDeskNode.appendChild(singleDeskNodeContent);
        getDesks.append(singleDeskNode);
    }
}