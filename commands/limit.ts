import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("limit")
    .setDescription("Set the limit of users in your voice channel")
    .addIntegerOption((option) => option
      .setName("limit")
      .setDescription("The new limit of users in your voice channel")
      .setRequired(true)
  ),
  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    getVoiceChannelFromHash(member.id)
      .then(channelId => { 
        if (!channelId) {
          return interaction.reply("You are not in a voice channel");
        }
        
        const limit = interaction.options.get("limit")?.value as number;
        if (limit > 99 || limit < 0)
          return interaction.reply("The limit must be between 0 and 99");

        const voiceChannel = guild?.channels.cache.get(channelId as string);
        voiceChannel?.edit({
          userLimit: interaction.options.get("limit")?.value as number
        })
          .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply(
              `Set the limit of users in your voice channel to \`${interaction.options.get("limit")?.value}\``
            )
          })
          .catch((error) => console.log(error));
      })

  }
}