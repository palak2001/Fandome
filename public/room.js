let did = window.location.href.split('/')[4];
let rid;

async function getRid(){
    await database.ref('desks/'+did).once('value',function(snap){
        rid = snap.val().roomId;
        console.log(rid);
    });
}

async function sendMessage(){
    let message = document.getElementById('message');
}