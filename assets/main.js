const getJSON = async url => {
    const response = await fetch(url);
    return response.json(); // get JSON from the response 
}
console.log("Hey there! I'm glad you're checking out my code. Everything is available on GitHub!");
var socket = io();
// banner switcher
var curBanner = "all";
function switchBanner(newBanner) {
    curBanner = newBanner;
    getChars("all");
}
// character handler
var characters = {};
var collectedChars = {};
function getChars(condition, isCollected) {
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
                if (currentTab == "collection") {
                    console.log(collectedChars)
                     if (collectedChars.indexOf(chars) == -1) {
                        var uncollected = document.createElement("div");
                            uncollected.classList.add("uncollected");
                            div.prepend(uncollected);
                        var uncollectedText = document.createElement("p");
                            uncollectedText.classList.add("uncollected-text");
                            uncollectedText.innerHTML = "Not owned!"
                            uncollected.append(uncollectedText);
                    };
                }
            }
        }
    }
}
// Fetching the characters from the json file
getJSON("https://raw.githubusercontent.com/AzzaDeveloper/loly-impact/master/characters.json")
.then(data => {
    characters = data;
    getChars("all");
});
var userID = "";
var collectedChars = {};
// Switching tabs
var currentTab = "characters";
function switchTabs(tab) {
    if (tab == "collection") {
        if (Object.keys(collectedChars).length === 0 && collectedChars.constructor === Object) {
            alert("You have not logged in!");
            return
        }
    }
    document.getElementById(currentTab).classList.remove("selected")
    currentTab = tab;
    document.getElementById(currentTab).classList.add("selected")
    switch (tab) {
        case "characters":
            getChars("all");
            break;
        case "collection":
            getChars("all");
            break;
    }
}
// users data and stuff

var loggedIn = false;
function login(response) {
    if (!loggedIn) {

    }
}
 // Handling the login button
var overlay = "";
function loginHandler(state) {
    if (state) {
        if (overlay == "") {
            // Blurring and darkening the background
            document.getElementsByTagName("body")[0].classList.add("blur");
            // Prompting the login
            document.getElementById("login-module").style.display = "block";
            overlay = "login";
        }
    } else {
        if (overlay == "login") {
            document.getElementById("login-module").style.display = "none";
        } else if (overlay == "verify") {
            document.getElementById("verify").style.display = "none";
        }
        document.getElementsByTagName("body")[0].classList.remove("blur");
        overlay = "";
    }
}
// Handling the regis/log button
function regis() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // Sending a request to the server with the said creds
    socket.emit("login", {username: username, password: password})
}
// Handling
socket.on("loginState", (data) => {
    if (overlay == "login") {
        document.getElementById("login-module").style.display = "none";
        document.getElementById("verify").style.display = "block";
        overlay = "verify";
        if (data.state == "register") {
            document.getElementById("verify-header").innerHTML = "Please verify your account! Message Loly on messenger with the following command:"
            document.getElementById("verify-text").innerHTML = "~verify " + data.payload;
        } else if (data.state == "success") {
            document.getElementById("verify-header").innerHTML = "Login success!"
            document.getElementById("verify-text").innerHTML = "Go ahead and close this window. It's the little X button up there.";
            collectedChars = data.payload;
        } else if (data.state == "wrongPassword") {
            document.getElementById("verify-header").innerHTML = "Wrong password!"
            document.getElementById("verify-text").innerHTML = "Close this window and try logging in again.";
        }
    }
})