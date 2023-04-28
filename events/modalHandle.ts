import { ModalSubmitInteraction } from "discord.js";

export default {
  async execute(interaction: ModalSubmitInteraction) {
    const channelId = interaction.customId;

    const channel = interaction.guild?.channels.cache.get(channelId);
    if (!channel) return interaction.reply("An error occured while renaming your voice channel");

    const nameInput = interaction.fields.getTextInputValue("sadaa-name-input");
    if (!nameInput) return interaction.reply("An error occured while renaming your voice channel");

    await channel.setName(nameInput);
    await interaction.reply("Your voice channel has been renamed ✨");
  },
}