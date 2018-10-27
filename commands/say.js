const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let messageArray = message.content.split(" ");
	messageReturned = messageArray.slice(1).join(" ");//Remove "!say" from beginning of message
	console.log(`Deleted ${message}, Responded ${messageReturned}`);
	message.delete().catch(O_o=>{});
	if(messageReturned == "")return;
	return message.channel.send(messageReturned);

}

module.exports.help = {
	name: "say"
}