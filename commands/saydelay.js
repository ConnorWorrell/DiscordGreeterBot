const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let messageArray = message.content.split(" ");
	messageReturned = messageArray.slice(2).join(" ");//Remove "!say" from beginning of message
	console.log(`Deleted ${message}, Responded ${messageReturned}`);
	message.delete().catch(O_o=>{});

	var delayMessage = setTimeout(sendMessage.bind(null,messageReturned), parseInt(messageArray[1],10)*1000);
	function sendMessage(msg){
		if(msg == "")return;
		return message.channel.send(msg);
	}
}

module.exports.help = {
	name: "saydelay"
}