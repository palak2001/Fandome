var uid;
    auth.onAuthStateChanged(function(user){
        uid = user.uid;
        console.log("Logged in user id: " + uid);
    });
    
function createDesk(){
    
    var name = document.getElementById("deskName").value;
    var description = document.getElementById("deskDescription").value;
    console.log(uid);
    var roomRef = database.ref().child('rooms').push().key;
    var deskRef = database.ref().child('desks').push();
    var desk = {
        "name" : name,
        "did" : deskRef.key,
        "owner" : uid,
        "description" : description,
        "roomId" : roomRef,
        "userList" : [uid],
        "followers" : 1,
        "likes" : 0,
        "dislikes" : 0,
        "rating" : 0
    };
    deskRef.set(desk);
}


function getDidByDeskName(name){
    console.log(name);
    database.ref('desks/').on('value',function(snapshot) {
        snapshot.forEach(function(child){
            var l=[];
            child.forEach(function(subChild){
               l.push(subChild.val()); 
            });
            if(l[5]==name){
                return l[1];
            }
        });
    });
}

function joinDesk(){
    var name = document.getElementById("joinDeskName").value;
    var did;
    database.ref('desks/').on('value',function(snapshot) {
        snapshot.forEach(function(child){
            var l=[];
            child.forEach(function(subChild){
               l.push(subChild.val()); 
            });
            if(l[5]==name){
                did = l[1];
            }
        });
    });
    console.log("did : "+ did);
    database.ref("desks/" + did + "/userList").push().set(uid);
}


/*function getAllDesks(){
    console.log("getAllDesks() function is called")
    var l=[];
    firebase.database().ref("desks").on('value',function(snap){
        snap.forEach(function(child){
            child.forEach(function(subChild){
                if(subChild.key=="username"){
                    l.push(subChild.val());
                }
            });
        })
    });
    getUsers = document.getElementById("allUsers");
    for( var i =0; i<l.length; i++){
        var singleUserNode = document.createElement("li");
        var singleUserNodeContent = document.createElement("a");
        singleUserNodeContent.textContent = l[i];
        singleUserNodeContent.href = getUidByUsername(l[i]);
        singleUserNode.appendChild(singleUserNodeContent);
        getUsers.append(singleUserNode);
    }
}

function findUser(){
    var username = document.getElementById("findUser").value;
    var uid = getUidByUsername(username);
    var userInfo = document.getElementById("userInfo");
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