import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction, GuildMember, Role, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks the voice channel"),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    getVoiceChannelFromHash(member.id)
      .then(channelId => {
        if (!channelId)
          return interaction.reply("You are not in a voice channel");

        const voiceChannel = guild?.channels.cache.get(channelId) as VoiceChannel;

        voiceChannel.permissionOverwrites.edit(guild?.roles.everyone as Role, {
          Connect: false,
        })
        .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply("The voice channel has been locked");
          });
      })
      .catch(error => console.log(error))
  }
}