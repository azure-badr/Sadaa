import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("permissions")
    .setDescription("Change the permissions of your voice channel")
    .addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription("Add a permission to your voice channel")
        .addMentionableOption(option =>
          option
            .setName("name")
            .setDescription("The name of the role or user to add")
            .setRequired(true)
      )
  )
    .addSubcommand(subcommand =>
      subcommand
        .setName("remove")
        .setDescription("Remove a permission from your voice channel")
        .addMentionableOption(option =>
          option
            .setName("name")
            .setDescription("The name of the role or user to remove")
            .setRequired(true)
      )
  )
    .addSubcommand(subcommand =>
      subcommand
        .setName("list")
        .setDescription("List the permissions of your voice channel")
  ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        return interaction.reply("Add");
      case "remove":
        return interaction.reply("Remove");
      case "list":
        return interaction.reply("List");
    }
  }
}