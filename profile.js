var database = firebase.database();

function getUserProfile()
{
    auth.onAuthStateChanged(function(user){
        console.log(user.uid);
        var email;
        var name;
        var l=[];
        database.ref('users/'+ user.uid ).on('value',function(snapshot) {
            snapshot.forEach(function(_child){
                console.log(_child.val());
                l.push(_child.val());
            });
            email = l[0];
            name = l[1];
            username = l[2];
        });
    });
}

function getAllUsers()
{
    console.log("getAllUsers() function is called")
    var l=[];
    firebase.database().ref("users").on('value',function(snap){
        snap.forEach(function(child){
            var temp = [];
            child.forEach(function(subChild){
                temp.push(subChild.val());
            });
            l.push(temp[2]);
        })
    });

    getUsers = document.getElementById("allUsers");
    for( var i =0; i<l.length; i++){
        var singleUserNode = document.createElement("li");
        var singleUserNodeContent = document.createElement("a");
        singleUserNodeContent.textContent = l[i];
        singleUserNodeContent.href = getProfileByUsername(l[i]);
        singleUserNode.appendChild(singleUserNodeContent);
        console.log(singleUserNodeContent);
        getUsers.append(singleUserNode);
    }
}

function findUser(){
    var username = document.getElementById("findUser").value;
    var infoText = getProfileByUsername(username);
    var userInfo = document.getElementById("userInfo");
    for( var i =0; i<infoText.length; i++){
        var node = document.createElement("li");
        var nodeContent = document.createElement("a");
        nodeContent.textContent = infoText[i];
        //singleUserNodeContent.href = getProfileByUsername(l[i]);
        node.appendChild(nodeContent);
        console.log(nodeContent);
        userInfo.append(node);
    }
}

function getProfileByUsername(username)
{
    var email;
    var name;
    firebase.database().ref("users").on('value', function(snap){
        snap.forEach(function(child){
            var l=[];
            child.forEach(function(subChild){
                l.push(subChild.val());
            });
            if(l[2]==username){
                email = l[0];
                name = l[1];
           }
       });
     });
    console.log(email);
    console.log(name);
    var info = [];
    info.push(email);
    info.push(name);
    return info;
}