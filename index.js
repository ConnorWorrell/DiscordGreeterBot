const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

bot.on("error", (e) => console.error(e));

bot.on("ready", async () =>{

	console.log(`${bot.user.username} is online!`)
	bot.user.setActivity("with BOTy stuff");

})

bot.on("message", async message =>{

	console.log(`${message.createdAt} ${message.author} ${message.channel} ${message.content}`)

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	if(cmd === `${prefix}ping`){
		console.log(`Bot Pongs the ping`);
		return message.channel.send("Pong");
	}

	if(cmd === `${prefix}serverinfo`){

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

	if(cmd === `${prefix}botinfo`){
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

	if(cmd === `${prefix}report`){
		console.log(`User Reported`);
		let rUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
		if(!rUser) return message.channel.send("Couldn't find user.");
		let reason = args.join(" ").slice(22);

		let reportEmbed = new Discord.RichEmbed()
		.setDescription("Reports")
		.setColor("#15f153")
		.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
		.addField("Reported By", `${message.author} with ID: ${message.author.id}`)
		.addField("Channel", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", reason);

		let reportschannel = message.guild.channels.find(x => x.name === "reports");
		if(!reportschannel) return message.channel.send("Couldn't find reports channel.")


		message.delete().catch(O_o=>{});
		reportschannel.send(reportEmbed);
		return;

	}

	if(cmd === `${prefix}say`){
		messageReturned = messageArray.slice(1).join(" ");
		console.log(`Deleted ${message}, Responded ${messageReturned}`);
		message.delete().catch(O_o=>{});
		return message.channel.send(messageReturned);
	}

	if(cmd === `${prefix}clean`){
		console.log(`Cleaned Messages`);
		async function clear() {
			message.delete().catch(O_o=>{});
			const fetched = await message.channel.fetchMessages({limit:99});
			message.channel.bulkDelete(fetched);
		}
		clear();
	}

})

bot.login(botconfig.token);


