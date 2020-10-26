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
                l.push(_child.val);
            });
            email = l[0];
            name = l[1];
            username = l[2];
        });
    });
}

function getProfile()
{
    var email;
    var name;
    var l=[];
    var username = document.getElementById("username");
    //find uid from username
    var uid = getUidFromUsername(username.value);
    var ref = database.ref('users/'+ uid ).on('value',function(snapshot) {
        snapshot.forEach(function(_child){
            console.log(_child.val());
            l.push(_child.val);
        });
        email = l[0];
        name = l[1];
        username = l[2];
    });
}

/*function getUidFromUsername(username)
{
    var uid;
    var ref = database.ref('uidusername/'+username).on(value,function(snapshot){
        uid = snapshot.key;
    });
    return uid;
}*/