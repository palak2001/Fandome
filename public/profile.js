async function getUserProfile(){
    
    let email,name,uid,username;
    await auth.onAuthStateChanged(function(user){
        console.log(user.uid);
        let l=[];
        database.ref('users/'+ user.uid ).once('value',function(snapshot) {
            snapshot.forEach(function(_child){
                console.log(_child.val());
                l.push(_child.val());
            });
            email = l[0];
            name = l[1];
            uid = user.uid;
            username = l[3];
        });
    });
    let info=[];
    info.push({"email" : email});
    info.push({"name" : name});
    info.push({"uid" : uid});
    info.push({"username" : username});
    return info;
}

async function getAllUsers()
{
    console.log("getAllUsers() function is called")
    let usersList=[];
    await database.ref("users").once('value',function(snap){
        snap.forEach(function(child){
            let childInfo = child.val();
            usersList.push(childInfo.username);
        })
    });
    getUsers = document.getElementById("allUsers");
    for( let i =0; i<usersList.length; i++){
        let singleUserNode = document.createElement("li");
        let singleUserNodeContent = document.createElement("a");
        singleUserNodeContent.textContent = usersList[i];
        singleUserNodeContent.href = ("profile/"+await getUidByUsername(usersList[i]));
        singleUserNode.appendChild(singleUserNodeContent);
        getUsers.append(singleUserNode);
    }
}

async function findUser(){
    let username = document.getElementById("findUser").value;
    let uid = await getUidByUsername(username);
    let userInfo = document.getElementById("userInfo");
    let node = document.createElement("a");
    node.textContent = username;
    node.href = uid;
    console.log(node);
    userInfo.append(node);
}

async function getUsernameByUid(uid){
    let username;
    await database.ref("users/" + uid).once('value' , function(child){
        let childInfo = child.val();
        username = childInfo.username;
    });
    return username;
}

async function getUidByUsername(username)
{
    let email,name,uid;
    await firebase.database().ref("users").once('value', function(snap){
        snap.forEach(function(child){
            let childInfo = child.val();
            if(childInfo.username == username){
                email = childInfo.email;
                name = childInfo.name;
                uid = child.key;
            }
        })
     });
    console.log(uid);
    return uid;
}