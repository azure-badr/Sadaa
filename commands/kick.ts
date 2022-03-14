import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the voice channel")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to kick")
      .setRequired(true)
  ),
  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    getVoiceChannelFromHash(member.id)
      .then(channelId => {
        if (!channelId)
          return interaction.reply("You are not in a voice channel");

        const voiceChannel = guild?.channels.cache.get(channelId) as VoiceChannel;
        const memberToKick = interaction.options.get("user")?.member as GuildMember;
        
        if (voiceChannel.members.has(memberToKick.id)) 
          memberToKick.voice.setChannel(null);
        
        voiceChannel.permissionOverwrites.edit(memberToKick, {
          CONNECT: false
        })
        .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply(`Kicked ${memberToKick.user.username} from the voice channel. \nThey can no longer join.`);
          });
      })
      .catch(error => console.log(error))
  }
}