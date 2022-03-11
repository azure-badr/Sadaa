import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("slash")
    .setDescription("Slash command"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Hello world");
  }
}
