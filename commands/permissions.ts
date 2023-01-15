import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v9";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";

import { getVoiceChannelFromHash } from "../utils/vc";

import { mehmaanChannelId } from "../config";

export default {
  data: new SlashCommandBuilder()
    .setName("permissions")
    .setDescription("Change the permissions of your voice channel")
    .addSubcommand(subcommand =>
      subcommand
        .setName("list")
        .setDescription("List the permissions of your voice channel")
    ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.member as GuildMember;
    const guild = interaction.guild;

    const voiceChannelId = await getVoiceChannelFromHash(member.id);
    if (!voiceChannelId)
      return interaction.reply("You are not in a voice channel");
    
    const voiceChannel = await guild?.channels.fetch(voiceChannelId) as VoiceChannel;
    switch (subcommand) {
      case "list":
        const embed = {
          title: `Permissions for your channel`,
          description: '',
          color: 0x303136,
        }

        const permissions = voiceChannel.permissionOverwrites.cache
        for (const permission of permissions.values()) {
          if (permission.type === "member") {
            const member = await guild?.members.fetch(permission.id) as GuildMember;
            if (!member)
              continue;
            
            const allowedToConnect = permission.allow.has(PermissionFlagsBits.Connect);
            embed.description += `\n(user) **${member.displayName}**: ${allowedToConnect ? "allowed" : "denied"}`
          }

          if (permission.type === "role") {
            const role = guild?.roles.cache.get(permission.id);
            if (!role)
              continue;
            
            if (role.name === "@everyone")
              continue;
            
            if (role.id === mehmaanChannelId) {
              embed.description += `\n(role) **Mehmaan**: this role is automatically added to all voice channels`
              continue;
            }
            
            const allowedToConnect = permission.allow.has(PermissionFlagsBits.Connect);
            embed.description += `\n(role) **${role.name}**: ${allowedToConnect ? "allowed" : "denied"}`
          }
        }
        return interaction.reply({ embeds: [embed] });
    }
  }
}