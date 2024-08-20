import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ChatInputCommandInteraction, GuildMember, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getVoiceChannelFromHash } from "../utils/vc";

import {
  nameChangeAllowedRoleId
} from "../config";

export default {
  data: new SlashCommandBuilder()
    .setName("name")
    .setDescription("Renames your voice channel"),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;

    getVoiceChannelFromHash(member.id)
      .then(async channelId => {
        if (!channelId)
          return interaction.reply("You are not in an active voice channel");
        
        const modal = new ModalBuilder()
          .setCustomId(`${channelId}`)
          .setTitle("Rename your voice channel")
        
        const nameInput = new TextInputBuilder()
          .setCustomId("sadaa-name-input")
          .setLabel("Name of your voice channel")
          .setPlaceholder("Enter a name. Please do not set anything inappropriate")
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(32)
          .setRequired(true)
        
        modal.addComponents(
          new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(nameInput)
        );

        await interaction.showModal(modal);
      });
  }
}
