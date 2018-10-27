const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
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

module.exports.help = {
	name: "clean"
}