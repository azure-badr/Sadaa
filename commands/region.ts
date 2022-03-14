import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, saveVoiceChannel } from "../utils/vc";

export default {
  data: new SlashCommandBuilder()
    .setName("region")
    .setDescription("Change the region of the voice channel")
    .addStringOption(option => option
      .setName("region")
      .setDescription("The region to change to")
        .addChoice("US West", "us-west")
        .addChoice("Brazil", "brazil")
        .addChoice("Hong Kong", "hongkong")
        .addChoice("India", "india")
        .addChoice("Japan", "japan")
        .addChoice("Rotterdam", "rotterdam")
        .addChoice("Russia", "russia")
        .addChoice("Singapore", "singapore")
        .addChoice("South Korea", "south-korea")
        .addChoice("South Africa", "southafrica")
        .addChoice("Sydney", "sydney")
        .addChoice("US Central", "us-central")
        .addChoice("US East", "us-east")
        .addChoice("US South", "us-south")
        .addChoice("Automatic", "automatic")
      .setRequired(true)
  ),
  async execute(interaction: CommandInteraction) {
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