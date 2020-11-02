import * as Model from "../model/model.js"; //imports anything from model.js that has export on it

function initListeners() {
    $("#genres").change(function() {
        Model.getMusicByGenre(this.value);
    });
}


$(document).ready(function () {
    Model.initFirebase();
    Model.signIn(initListeners);
});