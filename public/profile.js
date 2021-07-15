async function getUserProfile(){
    $('#myInfo').empty();
    await auth.onAuthStateChanged(async function(user){
        console.log(user.uid);
        await database.ref('users/'+ user.uid ).once('value',function(child) {
            let childInfo = child.val();
            console.log(childInfo);

            let div = document.createElement('div');
            div.className = "card";
            div.style = "style.css"

            let img = document.createElement('input');
            img.setAttribute("type", "file");
            img.name = "profile_photo";
            img.placeholder = "Upload profile photo";

            let name = document.createElement("input");
            name.type = "text";
            name.name = "Name";
            if(childInfo.name==undefined){
                namePlace = "Anonymous";
            }
            else{
                namePlace = childInfo.name
            }
            name.placeholder = namePlace;

            let username = document.createElement('h3');
            username.innerHTML = "Username: " + childInfo.username;

            let email = document.createElement('h3');
            email.innerHTML = "Email: " + childInfo.email;

            let save = document.createElement('button');
            save.innerHTML = "Save"
            save.addEventListener("click",async function () {await editProfile(name.value,img,childInfo.username,uid)});
            
            div.append(img,name,username,email,save);
            $('#myInfo').append(div);

        });
    });
}

async function uploadImage(image,username,uid){
    let storageref = firebase.storage().ref('gallery/' + username);
    let uploadTask = storageref.put(image);
    await uploadTask.on('state_changed', async function(snapshot){
    }, async function(error){
        console.error(error);
        }, async function() {
            await uploadTask.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
                console.log('File available at', downloadURL);
                let pathReference = firebase.storage().ref('gallery/'+ username);
                let imgurl;
                await pathReference.getDownloadURL().then(function(url) {
                imgurl =  url;});
                await database.ref("users/" + uid ).update({"image": imgurl});
            });
    });
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

async function editProfile(name,image,username,uid){
    console.log("save working.............")
    console.log(image.files);
    if(image.files.length>1){
        console.log(image.files);
        await uploadImage(image.files[0],username,uid);
    }
    if(name!=undefined){
        await database.ref("users/" + uid ).update({"name": name});
    }
    window.location.href = "desk.html";
}