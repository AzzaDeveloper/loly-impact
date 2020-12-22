const getJSON = async url => {
    const response = await fetch(url);
    return response.json(); // get JSON from the response 
}
var socket = io();
// banner switcher
var curBanner = "all";
function switchBanner(newBanner) {
    curBanner = newBanner;
    getChars("all");
}
// character handler
var characters = {};
function getChars(condition) {
    var currentDiv = document.getElementById("inner-container");
        // Clearing the current content of the container
        currentDiv.innerHTML = "";
    for(var banner in characters) {
        // Skipping banners we dont need
        if (curBanner != "all") {
            if (banner != curBanner) {
                continue;
            }
        }
        for(var rarities in characters[banner].chars) {
            // Skipping characters we dont need
            if (condition != "all") {
                if (rarities != condition) {
                    continue;
                }
            }
            for (var chars in characters[banner].chars[rarities]) {
                // Check if event banner and skip to prevent duplicated chars if the curBanner isnt an event banner
                if (curBanner != "all") {
                    if (characters[curBanner].type != "event") {
                        if (characters[banner].type == "event") {
                            continue;
                        }
                    }
                }
                const char = characters[banner].chars[rarities][chars]
                // Adding attributes to a character card
                var div = document.createElement("div");
                    div.classList.add("char");
                    currentDiv.appendChild(div)
                var img = document.createElement("img");
                    if (rarities != "exclusive") {
                        img.src = characters[banner].base + "/" + rarities + "/" + chars + ".jpg";
                    } else {
                        img.src = banner + "/exclusive.jpg";
                    }
                    img.classList.add("char-img");
                    div.appendChild(img)
                var char_name = document.createElement("p");
                    char_name.innerHTML = char;
                    char_name.title = char;
                    char_name.classList.add("char-name");
                    div.appendChild(char_name)
                var char_internal = document.createElement("p");
                    char_internal.innerHTML = chars;
                    char_internal.classList.add("char-internal");
                    div.appendChild(char_internal)
                var char_rarity = document.createElement("p");
                    switch (rarities) {
                        case "exclusive":
                            char_rarity.innerHTML = "🌟🌟🌟🌟🌟"
                            break;
                        case "five_star":
                            char_rarity.innerHTML = "⭐⭐⭐⭐⭐"
                            break;
                        case "four_star":
                            char_rarity.innerHTML = "⭐⭐⭐⭐"
                            break;
                        case "three_star":
                            char_rarity.innerHTML = "⭐⭐⭐"
                            break;
                        case "two_star":
                            char_rarity.innerHTML = "⭐⭐"
                            break;
                    }
                    char_rarity.classList.add("char-rarity");
                    div.appendChild(char_rarity)
            }
        }
    }
}
// Get the characters from the json file
getJSON("https://raw.githubusercontent.com/AzzaDeveloper/loly-impact/master/characters.json")
.then(data => {
    characters = data;
    getChars("all");
});
// Facebook login status
var loggedIn = false;
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1273146346393658',
      cookie     : true,
      xfbml      : true,
      version    : 'v9.0'
    });
    FB.getLoginStatus(function(response) {
        if (response.status == "connected") {
            document.getElementById("login").innerHTML = "Logged in as " + "";
            socket.emit("userdataRequest", response.authResponse.userID);
            loggedIn = true;
        }
    });
    FB.AppEvents.logPageView();   
      
  };

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//