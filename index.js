//const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const axios = require("axios")
const fs = require("fs");
require('dotenv').config();

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

var DiscordKey = process.env.DiscordKey;
var YandexAPIKey = process.env.YandexAPIKey;
let prefix = process.env.Prefix;

fs.readdir("./commands/", (err, files) => {
	if(err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0){
		console.log("Couldn't find commands")
	}

	jsfile.forEach((f,i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded`);
		bot.commands.set(props.help.name, props);
	})

})

bot.on("error", (e) => console.error(e));

bot.on("ready", async () =>{
	console.log(`${bot.user.username} is online!`)
	bot.user.setActivity("with BOTy");

	//unmute anyone who is muted on startup since bot won't unmute them if it restarts
	const guild = bot.guilds.map(g => g.name);
	for (i = 0; i < guild.length; i++){
		iguild = bot.guilds.find(x => x.name = guild[i])
		const member = iguild.members.map(x => x.id);
		for (j = 0; j < member.length; j++){
			if(iguild.member(member[j]).roles.find(x => x.id === iguild.roles.find(x => x.name === 'muted').id) !== null) {
				console.log("Unmuted");
				let mutedMember = iguild.member(member[j]);
				const muterole = iguild.roles.find(x => x.name === 'muted');
				mutedMember.removeRole(muterole.id);
			}
		}
	}
})

bot.on("message", async message =>{

	console.log(`${message.createdAt} ${message.author} ${message.channel} ${message.content}`)

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	let commandfile = bot.commands.get(cmd.toLowerCase().slice(prefix.length));

	//If muted then delete any message they type in
	if(message.member.roles.find(x => x.name === "muted")){
		console.log("Deleted muted message");
		return message.delete().catch(O_o=>{});
	}

	if(commandfile) commandfile.run(bot,message,args);
	else{
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
	}

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
		!saydelay [seconds] [message] - Bot says message after time has passed
		!clean - Bot Deletes Last 100 Messages!
		`)
		.addField("Other:", `Translation - Automatically Translates All Text Into English
		(Powered by Yandex Translate)`);

		return message.channel.send(botembed);
	}

})

bot.login(DiscordKey);


