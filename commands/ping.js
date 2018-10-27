const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	console.log(`Bot Pongs the ping`);
	return message.channel.send("Pong");
}

module.exports.help = {
	name: "ping"
}