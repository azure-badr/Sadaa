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
        
        // Check if member has a role with nameChangeAllowedRoleId
        const hasNameChangeAllowedRole = member.roles.cache.some(role => role.id === nameChangeAllowedRoleId);
        if (hasNameChangeAllowedRole) {
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
          return;
        }
        
        await interaction.reply(
          "Renaming voice channels has been disabled **for now** due to safety concerns."
        );
        const channel = interaction.guild?.channels.cache.get(channelId);
        if (!channel) return;

        await channel.setName(`${member.displayName}'s VC`);

        await interaction.followUp(
          { content: "If you want to rename your voice channel to something else, please ask Fauj.", ephemeral: true }
        )

        return;
      });
  }
}
