var baseURL = 'https://api.nookipedia.com/nh/recipes';
var apiHeader = {'X-API-KEY': 'baf19b93-a306-413c-b641-ffcb8a59dc28'};
var versionHeader = {'Accept-Version': '1.3.0'};
var materialParam = '?material=';
var matArray = [];
var matString = "";
var _db;

var itemData = [];

// Gets all recipes from the API and puts it into an array.
function grabRecipes() {
    $.ajax({
        url: baseURL,
        type: 'GET',
        headers: {
            'X-API-KEY': 'baf19b93-a306-413c-b641-ffcb8a59dc28',
            'Accept-Version': '1.3.0'
        },
        success: function(data) {
            for(var x = 0; x < data.length; x++) {
                itemData.push(data[x]);
            }
            loadRecipes();
        },
        error: function(err) {
            console.log(err);
        }
    })


}

// Loads first 20 recipes onto the page
function loadRecipes() {
    var itemRecords = 20;
    var page = 0;
    var pagination = itemRecords * (page + 1);
    
    var paginateItems = itemData.slice(page, pagination);
    // console.log(paginateItems);
    var recipes = $();
 
    for(var x = 0; x < paginateItems.length; x++) {
        // console.log(paginateItems[x].image_url);
        recipes = recipes.add(
            `
                <div id="itemDiv" class="${paginateItems[x].name}" onclick=itemDetails(${x})>
                <img src="${paginateItems[x].image_url}" class="itemImg" width="153.6px" height="153.6px"/><br><br>
                    <span class="itemName">${paginateItems[x].name}</span>
                </div>
            `
        );
    }
    $("#itemContainer").append(recipes);

    var totalPages = (itemData.length) / 20;
    var pages = $();
        for(var x = 1; x < totalPages; x++) {
            pages = pages.add(
                `
                    <a href="#" onclick=gotoPage(${x})>${x}</a>
                `
            )
        }
    $("#itemPag").append(pages);


}


// When div is clicked, bring up the details of the item through a call to the array
// Loop through the name, if there's a space add %20
function itemDetails(index) {
    $.get(`../views/details/details.html`, (PageData) => {
        $("#app").html(PageData);
    })
    var itemName = itemData[index].name;
    itemName = encodeURIComponent(itemName.trim());
    $.ajax({
        url: baseURL + "/" + itemName,
        type: 'GET',
        headers: {
            'X-API-KEY': 'baf19b93-a306-413c-b641-ffcb8a59dc28',
            'Accept-Version': '1.3.0'
        },
        success: function(data) {
            var matLength = data.materials.length;
            for(var x = 0; x < matLength; x++) {
                if(matString === "" )
                matString += data.materials.count + " " + data.materials.name + ",";
            }
            var matLength = data.materials.length;
            // Puts materials into a string
            for(var x = 0; x < matLength; x++) {
                if(matString === "" )
                matString += data.materials.count + " " + data.materials.name + ",";
            }
            // Removes the last comma
            matString = matString.substring(0, matString.length - 1);
            console.log(matString);
            var detailedItem = $();
            detailedItem = detailedItem.add(
                `
                <div id="itemDiv">
                    <img src="${data.image_url}" class="itemImg" width="153.6px" height="153.6px"/><br><br>
                    <span class="itemName">${data.name}</span><br>
                    <span class="itemBuy">Can be purchased for ${data.buy.price} ${data.buy.currency}!</span><br>
                    <span class="itemSell">Can be sold for ${data.sell} Bells!</span><br>
                    <span class="itemMats">Materials required: ${matString}</span>
                </div>
                `
                
            )
            console.log(detailedItem);
            $("#detailsContainer").append(detailedItem);
        },
        error: function(err) {
            console.log(err);
        }
    })
}

// Pagination functionality
function gotoPage(num) {
    $("#itemContainer").empty();

    var itemRecords = 20;
    var nextStart = itemRecords * num;
    var nextEnd = nextStart + itemRecords;
    var paginateItems = itemData.slice(nextStart, nextEnd);
    console.log(paginateItems);
    var recipes = $();
    // console.log(itemData);
    for(var x = 0; x < paginateItems.length; x++) {
        // console.log(paginateItems[x].image_url);
        recipes = recipes.add(
            `
                <div id="itemDiv" onclick=itemDetails(${x})>
                <img src="${paginateItems[x].image_url}" class="itemImg" width="153.6px" height="153.6px"/><br><br>
                    <span class="itemName">${paginateItems[x].name}</span>
                </div>
            `
        );
    }
    $("#itemContainer").append(recipes);
}

// Listener for if a button is clicked on, will take them to appropriate page

function initListeners() {
    $("nav a").click((e) => {
        let buttonID = e.currentTarget.id;
        console.log(buttonID);
        $.get(`../views/${buttonID}/${buttonID}.html`, (PageData) => {
            console.log(PageData);
            $("#app").html(PageData);
            loadRecipes();
        })
    })

    $("#signup").click(function() {
        
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result.user.uid);

        })
        .catch(function(error) {
            // Error handling
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage + ' ' + errorCode + ' ', error);
        });
    })

    $("#signin").click(function() {
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Error handling
          var errorCode = error.code;
          var errorMessage = error.message;

        });
    })

    $("#signout").click(function () {
        firebase
        .auth()
        .signOut()
        .then(function() {
          _db = "";
        }).catch(function(error) {
          console.log("Error signing out: " + error);
        });
      });
}

function initViews() {
    $.get("../views/home/home.html", (homePageData) => {
        $("#app").append(homePageData);
        initListeners();
        loadRecipes();
    })
}

var username;
var password;


function initFirebase() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          console.log("user is here ", displayName, email, user);
          console.log("connected");
          _db = firebase.firestore();
          // ...
        } else {
          // User is signed out.
          // ...
          console.log("user is not there");
        }
      });
}


$(document).ready(() => {
    try {
        let app = firebase.app();
        initFirebase();
        initViews();
        grabRecipes();
        initListeners();
    } catch (e) {
        console.error(e);
    }

}) 

function searchAC() {
    console.log("Search AC works");
}

// If enter is pressed, it checks if it has a value, and if it does, it executes the search function
$(document).on('keypress', function(e) {
    if($('.searchBar').val()) {
        if(e.which === 13) {
            searchAC();
        }
    }
});
