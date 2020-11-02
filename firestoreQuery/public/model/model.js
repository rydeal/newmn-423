var _db; //An _ means that only this file can access

export function initFirebase() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("There is a user");
            getAllMusic();
        } else {
            console.log("No user");
            _db = "";
        }

        //callback();
    });
}

export function signIn(callback) {
    firebase
    .auth()
    .signInAnonymously()
    .then(function (result) {
        _db = firebase.firestore();
        callback();
    });
}

export function getMusicByGenre(genre) {
    if(genre == '') {
        getAllMusic();
    } else {
        $(".content").html('');
        _db
        .collection("Albums")
        .where("genre", "==", genre)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (document) {
                let music = document.data();
                $(".content")
                .append(`<div id="albumSpace"><img src="${music.photo}"
                 width="400" height="400" /><p><span class="titleModify">Artist:</span>
                 ${music.artist}<br /><br /><span class="titleModify">Album:</span> ${music.album}</p></div>`);
            });
        });
    }

}

export function getAllMusic() {
    $(".content").html('');

    _db
    .collection("Albums")
    .get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (document) {
            let music = document.data();
            $(".content")
            .append(`<div id="albumSpace"><img src="${music.photo}"
             width="400" height="400" /><p><span class="titleModify">Artist:</span>
             ${music.artist}<br /><br /><span class="titleModify">Album:</span> ${music.album}</p></div>`);
        });
    });
}
