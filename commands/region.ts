import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("region")
    .setDescription("Change the region of the voice channel")
    .addStringOption(option => option
      .setName("region")
      .setDescription("The region to change to")
      .addChoices(
          { name: "Automatic", value: "automatic"},
          { name: "US West", value: "us-west"},
          { name: "Brazil", value: "brazil"},
          { name: "Hong Kong", value: "hongkong"},
          { name: "India", value: "india"},
          { name: "Japan", value: "japan"},
          { name: "Rotterdam", value: "rotterdam"},
          { name: "Russia", value: "russia"},
          { name: "Singapore", value: "singapore"},
          { name: "South Korea", value: "south-korea"},
          { name: "South Africa", value: "southafrica"},
          { name: "Sydney", value: "sydney"},
          { name: "US Central", value: "us-central"},
          { name: "US East", value: "us-east"},
          { name: "US South", value: "us-south"},
          { name: "Automatic", value: "automatic" },
      )
      .setRequired(true)
  ),
  async execute(interaction: ChatInputCommandInteraction) {
    const region = interaction.options.get("region")?.value as string;
    const member = interaction.member as GuildMember;

    getVoiceChannelFromHash(member.id)
      .then(channelId => { 
        if (!channelId)
          return interaction.reply("You are not in a voice channel");

        const voiceChannel = member.guild?.channels.cache.get(channelId) as VoiceChannel;
        voiceChannel.setRTCRegion((region === "automatic" ? null : region))
          .then(async () => {
            await saveVoiceChannel(voiceChannel.id);
            return interaction.reply(`Set the region of the voice channel to ${region}`);
          });
      })
      .catch(error => console.log(error))
  }
}