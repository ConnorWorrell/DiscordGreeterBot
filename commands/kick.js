const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let kUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
	if(!kUser) return message.channel.send("Can't find user");
	let kReason = args.join(" ").slice(22);
	if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("Error: Impropper Permissions");
	if(kUser.permissions.has("KICK_MEMBERS")) return message.channel.send("Error: Can't kick someone with equal or higher permisions to you");

	let kickEmbed = new Discord.RichEmbed()
	.setDescription("Kick")
	.setColor("#efb61a")
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

module.exports.help = {
	name: "kick"
}