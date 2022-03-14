import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("allow")
    .setDescription("Allow a user to the voice channel")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to allow")
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
        const memberToAllow = interaction.options.get("user")?.member as GuildMember;
        
        voiceChannel.permissionOverwrites.edit(memberToAllow, {
          CONNECT: true
        })
          .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            interaction.reply(`Allowed ${memberToAllow.user.username} to the voice channel.`);
          });
      })
      .catch(error => console.log(error))
  }
}