const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

	tomute = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[0]));
	if(!tomute) return message.reply("Couldn't find user");
	if(!message.member.permissions.has("MUTE_MEMBERS")) return message.reply("Error: Incorrect Permissions");
	let muterole = message.guild.roles.find(x => x.name === "muted");
	//Start of create role
	if(!muterole){
		try{
			muterole = await message.guild.createRole({
				name: "muted",
				color: "#000000",
				permissions:[]
			})
			message.guild.channel.forEach(async (channels, id) => {
				await channels.overwritePermissions(muterole,{
					SEND_MESSAGES:false,
					ADD_REACTIONS:false
				});
			});
		}catch(e){
			console.log(e.stack);
		}
	}
	//End of create role
	let mutetime = args[2];
	if(!mutetime) return message.reply("Error: No time specified");

	await(tomute.addRole(muterole.id));
	message.reply(`<@${tomute.id}> has been muted for ${ms(mutetime)/1000} seconds`);
	setTimeout(function(){
		tomute.removeRole(muterole.id);
		message.channel.send(`<@${tomute.id}> has been unmuted`);
	}, ms(mutetime))
}

module.exports.help = {
	name: "tempmute"
}