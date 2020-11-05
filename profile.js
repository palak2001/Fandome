async function getUserProfile()
{
    var email;
    var name;
    var uid;
    var username;
    await auth.onAuthStateChanged(function(user){
        console.log(user.uid);
        var l=[];
        database.ref('users/'+ user.uid ).once('value',function(snapshot) {
            snapshot.forEach(function(_child){
                console.log(_child.val());
                l.push(_child.val());
            });
            email = l[0];
            name = l[1];
            uid = user.uid;
            username = l[2];
        });
    });
    var info=[];
    info.push({"email" : email});
    info.push({"name" : name});
    info.push({"uid" : uid});
    info.push({"username" : username});
    return info;
}

async function getAllUsers()
{
    console.log("getAllUsers() function is called")
    var usersList=[];
    await database.ref("users").once('value',function(snap){
        snap.forEach(function(child){
            child.forEach(function(subChild){
                if(subChild.key=="username"){
                    usersList.push(subChild.val());
                }
            });
        })
    });
    getUsers = document.getElementById("allUsers");
    for( var i =0; i<usersList.length; i++){
        var singleUserNode = document.createElement("li");
        var singleUserNodeContent = document.createElement("a");
        singleUserNodeContent.textContent = usersList[i];
        singleUserNodeContent.href = await getUidByUsername(usersList[i]);
        singleUserNode.appendChild(singleUserNodeContent);
        getUsers.append(singleUserNode);
    }
}

async function findUser(){
    var username = document.getElementById("findUser").value;
    var uid = await getUidByUsername(username);
    var userInfo = document.getElementById("userInfo");
    var node = document.createElement("a");
    node.textContent = username;
    node.href = uid;
    console.log(node);
    userInfo.append(node);
}

async function getUsernameByUid(uid){
    var username;
    await database.ref("users/" + uid).once('value' , function(snap){
        snap.forEach(function(child){
            if(child.key=="username"){
                username = child.val();
            }
        })
    });
    return username;
}

async function getUidByUsername(username)
{
    var email;
    var name;
    var uid;
    await firebase.database().ref("users").once('value', function(snap){
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
}