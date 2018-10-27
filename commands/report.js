const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	console.log(`User Reported`);
	let rUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));//First user mentioned is user being reported
	if(!rUser) return message.channel.send("Couldn't find user.");//Check to see if user was reported
	let reason = args.join(" ").slice(22);//remove the first 22 characters (nameID) from message

	let reportEmbed = new Discord.RichEmbed()
	.setDescription("Reports")
	.setColor("#dfe83a")
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

module.exports.help = {
	name: "report"
}