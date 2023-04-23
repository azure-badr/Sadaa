import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("name")
    .setDescription("Rename your voice channel")
    .addStringOption((option) => option
      .setName("name")
      .setDescription("The new name of your voice channel")
      .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    getVoiceChannelFromHash(member.id)
      .then(async channelId => {
        if (!channelId)
          return interaction.reply("You are not in a voice channel");
        
        const name = interaction.options.get("name")?.value as string;
        if (!(name === "default")) {
          await interaction.reply(
            "Renaming voice channels has been disabled **for now** due to safety concerns.\nIf you want to reset the name, type `/name default`."
          );

          await interaction.followUp(
            { content: "If you want to rename your voice channel to something else, please ask Fauj.", ephemeral: true }
          )

          return;
        }
        
        const voiceChannel = guild?.channels.cache.get(channelId);
        voiceChannel?.edit({ name: `${interaction.member?.user.username}'s VC` })
          .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply(`Renamed your voice channel to ${interaction.options.get("name")?.value}`)
          })
          .catch((error) => interaction.reply(`Failed to rename your voice channel, ${error}`));
        
        return;
        
        /*
        voiceChannel?.edit({ name })
          .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply(`Renamed your voice channel to ${interaction.options.get("name")?.value}`)
          })
          .catch((error) => interaction.reply(`Failed to rename your voice channel, ${error}`));
        */
      })
      .catch(error => console.log(error))
  }
}
