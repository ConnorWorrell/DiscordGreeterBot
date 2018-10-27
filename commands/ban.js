const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let bUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
	if(!bUser) message.channel.send("Can't find user");
	let bReason = args.join(" ").slice(22);
	if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Error: Impropper Permissions");
	if(bUser.permissions.has("BAN_MEMBERS")) return message.channel.send("Error: Can't ban someone with equal or higher permisions to you");

	let banEmbed = new Discord.RichEmbed()
	.setDescription("Ban")
	.setColor("#cc100a")
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

module.exports.help = {
	name: "ban"
}