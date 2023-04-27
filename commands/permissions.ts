import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v9";
import { ChatInputCommandInteraction, CommandInteraction, GuildMember, OverwriteType, VoiceChannel } from "discord.js";

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
  async execute(interaction: ChatInputCommandInteraction) {
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

        const voiceChannelPermissionsSorted = [];
        const permissions = voiceChannel.permissionOverwrites.cache
        for (const permission of permissions.values()) {
          if (permission.type === OverwriteType.Member) {
            const member = await guild?.members.fetch(permission.id) as GuildMember;
            if (!member)
              continue;
            
            const allowedToConnect = permission.allow.has(PermissionFlagsBits.Connect);
            voiceChannelPermissionsSorted.push({
              type: "user",
              name: member.displayName,
              allowedToConnect,
            });
          }

          if (permission.type === OverwriteType.Role) {
            const role = guild?.roles.cache.get(permission.id);
            if (!role)
              continue;
            
            if (role.name === "@everyone")
              continue;
            
            const allowedToConnect = permission.allow.has(PermissionFlagsBits.Connect);
            voiceChannelPermissionsSorted.push({
              type: "role",
              name: role.name,
              allowedToConnect,
            });
          }

          voiceChannelPermissionsSorted.sort((first, second) => {
            if (first.allowedToConnect === second.allowedToConnect)
              return first.name.localeCompare(second.name);
            
            return first.allowedToConnect ? -1 : 1;
          });

          embed.description = voiceChannelPermissionsSorted.map(permission => {
            return `(${permission.type}) **${permission.name}**: ${permission.allowedToConnect ? "allowed" : "denied"} `;
          }).join('\n');
        }
        return interaction.reply({ embeds: [embed] });
    }
  }
}