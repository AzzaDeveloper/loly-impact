const fs = require("fs");
//
const auth = require("./auth.json");
const login = require("facebook-chat-api");
//
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Facebook credentials
//var credentials = {email: auth.email, password: auth.password};
var id = "100059859331194"
// Gacha systems
var char_rarity = {
	standard: {
		three_star: 0.25,
		four_star: 0.1,
		five_star: 0.025,
	},
	event: {
		four_star: 0.2,
		five_star: 0.05,
		exclusive: 0.01
	}
}
const characters = require("./characters.json");
// User data
var users = {}
var rolled = false;
// Functions
function roll(message, name, user) {
	if (rolled) return;
	// messages to return
	var messages = [];
	// 0: the first message
	// 1: the rolling result message
	// 2: the character
	// 3: the rarity
	// Deciding which rarity get chosen
	var chance = Math.random();
	// Vanity text messages info
	var rarity = "";
	var color = ""
	var stars = ""
	var baseBanner = characters[user.banner].base;
	// Differing rarity based on banner type
	if (characters[user.banner].type == "standard") {
		if (chance <= char_rarity.standard.five_star) {
			rarity = "five_star"
			stars = "⭐⭐⭐⭐⭐"
			// Color and stars are not really needed since most 6* message is customized.
		} else if (chance <= char_rarity.standard.four_star) {
			rarity = "four_star"
			color = "purple"
			stars = "⭐⭐⭐⭐"
		} else if (chance <= char_rarity.standard.three_star) {
			rarity = "three_star"
			color = "blue"
			stars = "⭐⭐⭐"
		} else {
			rarity = "two_star"
			color = "blue"
			stars = "⭐⭐"
		}
	} else {
		if (chance <= char_rarity.event.exclusive) {
			rarity = "exclusive"
			stars = "🌟🌟🌟🌟🌟"
			// Color and stars are not really needed since most 6* message is customized.
		} else if (chance <= char_rarity.event.five_star) {
			rarity = "five_star"
			color = "yellow"
			stars = "⭐⭐⭐⭐⭐"
		} else if (chance <= char_rarity.event.four_star) {
			rarity = "four_star"
			color = "purple"
			stars = "⭐⭐⭐⭐"
		} else {
			rarity = "three_star"
			color = "blue"
			stars = "⭐⭐⭐"
		}
	}
	// Deciding which character gets chosen in the tier
	var character = "";
	if (characters[user.banner].type == "standard") {
		var keys = Object.keys(characters[baseBanner].chars[rarity]);
		character = keys[keys.length * Math.random() << 0];
	} else {
		var rand = Math.random();
		if (rarity == "exclusive") {
			for (var key in characters[user.banner].chars.exclusive) {
				character = key;
			}
		} else if (rarity == "five_star") {
			var keys = Object.keys(characters[user.banner].chars[rarity]);
			character = keys[keys.length * Math.random() << 0];
		} else if (rarity == "four_star") {
			if (rand < 0.5) {
				var keys = Object.keys(characters[user.banner].chars[rarity]);
				character = keys[keys.length * Math.random() << 0];
			} else {
				var keys = Object.keys(characters[baseBanner].chars[rarity]);
				character = keys[keys.length * Math.random() << 0];
			}
		} else if (rarity == "three_star") {
			if (rand < 0.25) {
				var keys = Object.keys(characters[user.banner].chars[rarity]);
				character = keys[keys.length * Math.random() << 0];
			} else {
				var keys = Object.keys(characters[baseBanner].chars[rarity]);
				character = keys[keys.length * Math.random() << 0];
			}
		}
	}
	console.log("character: " + character)
	// Sending the introductory message, customized for 5*
	var message = "";
	if (rarity == "five_star" || rarity == "exclusive") {
		switch (character) {
			case "blessed_ly":
				message = "💫 The most holy of stars heed your wish! 💫 \n\nA star, so bright it's blinding - who could it be?"
				break;
			case "handsome_hoang":
				message = "🔺 A sin redeemed, the heaven shoots a star accross the sky! 🔺 \n\nStrangely, the star seems to glow red. A rather unexpected gift from the above."
				break;
			case "voyage_math":
				message = "✨ Thousands of tiny stars followed by a what looks like the biggest of them all! ✨ \n\nThe star answers your request for help."
				break;
			case "fly_nhan":
				message = "♦️ There was no stars. Instead, there was someone who wanted to reach them. ♦️\n\nWill he be the one to ascend?"
				break;
			case "masochist_hoang":
				message = "🤤 The stars that flew down seems so... disgusting. 🤤\n\nWill this star really help you?"
				break;
			case "ngan":
				message = "🌟 That was no star that just descended - that was a god. 🌟\n\nShe radiates greatness from just sitting still."
				break;
			case "harem_ngan":
				message = "🌟 Are you sure that's a healthy amount of husbandos? 🌟\n\nYep. Totally."
				break;
			case "padoru":
				message = "That's not okay. It's Christmas, but still."
				break;
		}
		messages[0] = message;
	} else {
		messages[0] = "🌟 The star answers your call! 🌟 \n\nYou see a bright " + color + " star heading your way!";
	}
	// Construct message
	var msg = {};
	if (characters[user.banner].type == "standard") {
		msg = {
			body: name + ", you pulled a:\n" + characters[baseBanner].chars[rarity][character] + "\nRarity: " + stars,
			attachment: fs.createReadStream(__dirname + '/gacha/' + user.banner + "/" + rarity + "/" + character + ".jpg")
		}
	} else {
		if (rarity != "exclusive") {
			console.log("not exclusive")
			console.log(character)
			msg = {
				body: name + ", you pulled a character:\n" + characters[baseBanner].chars[rarity][character] + "\nRarity: " + stars,
				attachment: fs.createReadStream(__dirname + '/gacha/' + baseBanner + "/" + rarity + "/" + character + ".jpg")
			}
		} else {
			console.log("is exclusive: " + rarity)
			for (var char in characters[user.banner].chars[rarity]) {
				msg = {
					body: name + ", you pulled an event character:\n" + char + "\nRarity: " + stars,
					attachment: fs.createReadStream(__dirname + '/gacha/' + user.banner + "/exclusive.jpg")
				}
			}
		}
	}
	messages[1] = msg;
	messages[2] = character;
	messages[3] = rarity;
	// Not letting the player roll for another 2.5 second
	user.points -= 5;
	return messages;
}
// Loading user credentials
console.log("loading credentials")
var file = fs.readFileSync(__dirname + '/usersdata.json')
users = JSON.parse(file);
console.log(users)

// Initating
var running = true;
login(credentials, (err, api) => {
	if(err) return console.error(err);
	// Save the credentials
	fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	// Listen for chat
	api.listenMqtt((err, message) => {
		// Checking if events are being listened
		if (!running) return;
		// Returns the error if failed to listen.
		if(err) return console.error(err);
		// Checking if message fulfils the ~ prefix
		if (message.type == "message") {
			// Get the user data, if not then add and initialize
			var user = users[message.senderID]
			var init = {
				registerPoint: true,
				rollable: true,
				//
				collectedChars: [],
				points: 100,
				banner: "None",
				//
				totalChatCount: 0
			}
			if (user == undefined) {
				user = init; 
			}
			for(var key in init) {
				if (user[key] == undefined) {
					user[key] = init[key]
				}
			}
			user.rollable = true;
			user.registerPoint = true;
			if (message.body.substring(0, 1) == '~') {
				// Splitting it into arguments
				var args = message.body.substring(1).split(' ');
				const cmd = args[0];
				args = args.splice(1);
				// Get the user name
				//
				// Get the max amount of characters
				var maxChar = 0;
				for(var banner in characters) {
					if (characters[banner].type == "standard") {
						for(var star in characters[banner].chars) {
							for(var char in characters[banner].chars[star]) {
								maxChar++;
							}
						}
					} else {
						maxChar++;
					}
				}
				// Switch commands
				switch (cmd) {
					case "test":
						console.log(message.threadID)
						api.sendMessage("This is a test message.", message.threadID);
						break;
					case "topup":
					case "nap":
					case "pay":
						api.sendMessage("Loly-chan is free to play, but if you want to feed Bảo, go ahead and give him some cash.\nIt's 10k for 80 points, x2 bonus if first top up!", message.threadID);
						break;
					case "help":
						api.sendMessage("Check out Loly-chan's help page here!\nhttps://github.com/AzzaDeveloper/loly-impact/blob/main/HELP.md", message.threadID);
						break;
					case "pts":
						api.sendMessage("You have " + user.points + " points.", message.threadID)
						break;
					case "collection":
					case "chars":
						api.sendMessage("You have " + user.collectedChars.length + "/" + maxChar + " characters!", message.threadID)
						break;
					case "banners":
						if (args[0] != undefined) {
							if (characters[args[0]] != undefined) {
								api.sendMessage(characters[args[0]].name + "\n" + characters[args[0]].description, message.threadID)
							} else {
								api.sendMessage("Not a valid banner!", message.threadID)
							}
						} else {
							api.sendMessage("Standard banners:\nenglish10a1\n\nEvent banners:\nxmas", message.threadID)
						}
						break;
					case "banner":
						if (args[0] == undefined) {
							api.sendMessage("Your current banner is " + user.banner + ".", message.threadID)
						} else {
							console.log(args[0])
							if (characters[args[0]] != undefined) {
								user.banner = args[0];
								api.sendMessage("Succesfully changed banners.", message.threadID)
							} else {
								api.sendMessage("Not a valid banner!", message.threadID)
							}
						}
						break;
					case "roll":
						// Check if the user have enough points
						console.log(user.rollable)
						if (characters[user.banner] == undefined) {
							api.sendMessage("It seems you have an outdated/invalid banner.\nPlease set your banner with ~banner <banner name> or use ~banners to view current banners and try again.", message.threadID)
							return
						}
						if (user.rollable) {
							if (user.banner != "None") {
								if (user.points >= 5) {
									console.log("rolled request: " + user.rollable)
									api.getUserInfo(message.senderID, (err, ret) => {
										// Returns error if failed
										if(err) return console.error(err);
										// Getting the user name and running some code
										for(var prop in ret) {
											var name = ret[prop].firstName;
											// Roll results
											var messages = roll(message, name, user);
											// Send to group chat as well if it's a 5 star
											api.sendMessage(messages[0], message.threadID);
											setTimeout(() => {
												if (messages[3] == "five_star" || messages[3] == "exclusive") {
													api.sendMessage(messages[1], "3502467906442589")
												}
												api.sendMessage(messages[1], message.threadID)
											}, 500);
											// Adding the character to the list of collected characters
											if (user.collectedChars.indexOf(messages[2]) == -1) {
												user.collectedChars.push(messages[2])
											}
										}
									})
									// Not letting the player roll for another 2.5 seconds
									//user.rollable = false;
									setTimeout(() => {
										user.rollable = true;
										console.log("rollable again")
									}, 2500);
								} else {
									api.sendMessage("You do not have enough points to roll!", message.threadID)
								}
							} else {
								api.sendMessage("Please use ~banners to check for banners, and ~banner <banner name> to pick one!", message.threadID)
							}
						}
						break;
				}
			}
			// Get 1 point for everytime you chat, and limit them to 1 point per 2 second
			if (user.registerPoint) {
				user.points += 1;
				user.registerPoint = false;
				setTimeout(() => {
					user.registerPoint = true;
				}, 1000);
			}
		}
	});
	// Command lines
	rl.on('line', function (input) {
		if (input == "update") {
			api.getThreadList(100000, null, ["INBOX"], (err, list) => {
				for(var i = 0; i < list.length; i++) {
					api.sendMessage("Loly have been updated! Please check out https://github.com/AzzaDeveloper/loly-impact/blob/main/README.md", list[i].threadID);
				}
			});
		} else if (input == "stop") {
			api.getThreadList(100000, null, ["INBOX"], (err, list) => {
				for(var i = 0; i < list.length; i++) {
					api.sendMessage("Loly is stopping! The developer is updating Loly-chan~ please be patient!", list[i].threadID);
					running = false;
				}
			});
			fs.writeFileSync('usersdata.json', JSON.stringify(users));
		} else if (input == "announcement") {
			rl.question(`Enter message:`, (input) => {
				if (input != "exit") {
					api.getThreadList(100000, null, ["INBOX"], (err, list) => {
						for(var i = 0; i < list.length; i++) {
							api.sendMessage(input, list[i].threadID);
						}
					});
				} else {
					break
				}
			})
		}
	});	
});
// Autosaving
setInterval(() => {
	fs.writeFileSync('usersdata.json', JSON.stringify(users));
}, 1000);