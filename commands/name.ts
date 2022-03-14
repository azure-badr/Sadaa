import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceChannelFromHash } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("name")
    .setDescription("Rename your voice channel"),
  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    getVoiceChannelFromHash(member.id)
      .then(channelId => {
        if (!channelId)
          return interaction.reply("You are not in a voice channel");

        const voiceChannel = guild?.channels.cache.get(channelId);
        voiceChannel?.edit({ name: member.displayName })
          .then(() => interaction.reply("Your voice channel has been renamed"));
      })
      .catch(error => console.log(error))
  }
}
