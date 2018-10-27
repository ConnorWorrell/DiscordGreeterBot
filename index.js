//const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const axios = require("axios")
require('dotenv').config();

const bot = new Discord.Client({disableEveryone: true});

var DiscordKey = process.env.DiscordKey;
var YandexAPIKey = process.env.YandexAPIKey;
let prefix = process.env.Prefix;

bot.on("error", (e) => console.error(e));

bot.on("ready", async () =>{

	console.log(`${bot.user.username} is online!`)
	bot.user.setActivity("with BOTy");

})

bot.on("message", async message =>{

	console.log(`${message.createdAt} ${message.author} ${message.channel} ${message.content}`)

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	if(cmd.toLowerCase() === `${prefix}help`){
		console.log(`Help Requested`);
		let botembed = new Discord.RichEmbed()
		.setDescription("Help Page")
		.setColor("#15f153")
		.addField("Commands:",`!help - Displays This Page!
		!ping - Pong!
		!serverinfo - Displays Server Info!
		!botinfo - Displays Bot Info!
		!report @user reason - Reports user!
		!say message - Bot Says Message!
		!delaysay [seconds] [message] - Bot says message after time has passed
		!clean - Bot Deletes Last 100 Messages!
		`)
		.addField("Other:", `Translation - Automatically Translates All Text Into English
		(Powered by Yandex Translate)`);

		return message.channel.send(botembed);
	}

	//Lets Play Ping Pong
	if(cmd.toLowerCase() === `${prefix}ping`){
		console.log(`Bot Pongs the ping`);
		return message.channel.send("Pong");
	}

	//Display server info
	if(cmd.toLowerCase() === `${prefix}serverinfo`){

		console.log(`Bot Displayed Server Info`);

		let sicon = message.guild.iconURL;
		let serverembed = new Discord.RichEmbed()
		.setDescription("Server Information")
		.setColor("#15f153")
		.setThumbnail(sicon)
		.addField("Server Name", message.guild.name)
		.addField("Created On", message.guild.createdAt)
		.addField("You Joined", message.member.joinedAt)
		.addField("Total Members", message.guild.memberCount);

		return message.channel.send(serverembed);

	}

	//Display bot info
	if(cmd.toLowerCase() === `${prefix}botinfo`){
		console.log(`Bot Displayed Info`);
		let bicon = bot.user.displayAvatarURL;
		let botembed = new Discord.RichEmbed()
		.setDescription("Bot Information")
		.setColor("#15f153")
		.setThumbnail(bicon)
		.addField("Bot Name", bot.user.username)
		.addField("Created On", bot.user.createdAt);

		return message.channel.send(botembed);
	}

	//Report Command
	if(cmd.toLowerCase() === `${prefix}report`){
		console.log(`User Reported`);
		let rUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));//First user mentioned is user being reported
		if(!rUser) return message.channel.send("Couldn't find user.");//Check to see if user was reported
		let reason = args.join(" ").slice(22);//remove the first 22 characters (nameID) from message

		let reportEmbed = new Discord.RichEmbed()
		.setDescription("Reports")
		.setColor("#15f153")
		.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
		.addField("Reported By", `${message.author} with ID: ${message.author.id}`)
		.addField("Channel", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", reason);

		let reportschannel = message.guild.channels.find(x => x.name === "reports");//Find reports channel
		if(!reportschannel) return message.channel.send("Couldn't find reports channel.")//If you can't find reports channel


		message.delete().catch(O_o=>{});//Catch reports message
		reportschannel.send(reportEmbed);//Display imbed in reports channel
		return;

	}

	//Make the bot say something
	if(cmd.toLowerCase() === `${prefix}say`){
		messageReturned = messageArray.slice(1).join(" ");//Remove "!say" from beginning of message
		console.log(`Deleted ${message}, Responded ${messageReturned}`);
		message.delete().catch(O_o=>{});
		return message.channel.send(messageReturned);
	}

	if(cmd.toLowerCase() === `${prefix}delaysay`){
		messageReturned = messageArray.slice(2).join(" ");//Remove "!say" from beginning of message
		console.log(`Deleted ${message}, Responded ${messageReturned}`);
		//console.log(parseInt(messageArray[1],10)*1000);
		message.delete().catch(O_o=>{});

		var delayMessage = setTimeout(sendMessage.bind(null,messageReturned), parseInt(messageArray[1],10)*1000);
		function sendMessage(msg){
			return message.channel.send(msg);
		}
	}

	//Delete last 100 messages
	if(cmd.toLowerCase() === `${prefix}clean`){

		if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Error: Impropper Permissions");

		console.log(`Cleaned Messages`);
		async function clear() {
			message.delete().catch(O_o=>{});//Delete clean message
			const fetched = await message.channel.fetchMessages({limit:99});//Find last 99 messages
			message.channel.bulkDelete(fetched);//Delete the found messages
		}
		clear();
		return;
	}

	if(cmd.toLowerCase() === `${prefix}kick`){

		let kUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
		if(!kUser) message.channel.send("Can't find user");
		let kReason = args.join(" ").slice(22);
		if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("Error: Impropper Permissions");
		if(kUser.permissions.has("KICK_MEMBERS")) return message.channel.send("Error: Can't kick someone with equal or higher permisions to you");

		let kickEmbed = new Discord.RichEmbed()
		.setDescription("Kick")
		.addField("Kicked User", `${kUser} with ID ${kUser.id}`)
		.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
		.addField("Kicked In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", kReason);

		let kickChannel = message.guild.channels.find(x => x.name === "incidents");
		if(!kickChannel) return message.channel.send("Can't find incidents channel");

		message.guild.member(kUser).kick(kReason);
		kickChannel.send(kickEmbed);

	}

	if(cmd.toLowerCase() === `${prefix}ban`){

		let bUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
		if(!bUser) message.channel.send("Can't find user");
		let bReason = args.join(" ").slice(22);
		if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Error: Impropper Permissions");
		if(bUser.permissions.has("BAN_MEMBERS")) return message.channel.send("Error: Can't ban someone with equal or higher permisions to you");

		let banEmbed = new Discord.RichEmbed()
		.setDescription("Ban")
		.addField("Banned User", `${bUser} with ID ${bUser.id}`)
		.addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
		.addField("Banned In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", bReason);

		let banChannel = message.guild.channels.find(x => x.name === "incidents");
		if(!banChannel) return message.channel.send("Can't find incidents channel");

		message.guild.member(bUser).ban(bReason);
		banChannel.send(banEmbed);

	}

	//Tranlation of all text to english using yandex's api
	//Powered by yandex
	axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate',
		{
			params: {
				key: YandexAPIKey,
				text: message.content,
				lang: 'en'
			}
		}).then(res => {
			if (res.data.text[0] !== message.content){//check to see if translation english -> english
				let botembed = new Discord.RichEmbed()
				.setDescription("Translation")
				.setColor("#15f153")
				.setDescription(`User: ${message.author}
				Origional: ${message.content}
				Translation: ${res.data.text[0]}`);

				return message.channel.send(botembed);
				console.log(`Translated Message to english`);
			}
			else{
				console.log(`Message Alreay In English`);
			}
		})

})

bot.login(DiscordKey);


