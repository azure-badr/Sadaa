import { CategoryChannel, ChannelType, GuildMember, VoiceChannel, VoiceState } from "discord.js"

import {
  voiceChannelId,
  categoryId,
  modRoleId,
  defaultUserLimit,
  defaultBitrate
} from "../config";
import { addActiveVoiceChannel, isVoiceChannelSaved } from "../utils/vc";
import { PermissionFlagsBits } from "discord.js";

async function createVoiceChannel(voiceState: VoiceState) {
  const guild = voiceState.guild;
  const member = voiceState.member as GuildMember;


  try {
    const channelCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

    const memberChannel = await guild.channels.create({
      name: `${member.user.username}'s VC`,
      type: ChannelType.GuildVoice,
      bitrate: defaultBitrate,
      userLimit: defaultUserLimit,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: member?.id,
          allow: [
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers,
            PermissionFlagsBits.MoveMembers,
          ],
        },
        {
          id: modRoleId,
          allow: [PermissionFlagsBits.ManageChannels],
        },
      ],
      parent: channelCategory,
    });
    
    addActiveVoiceChannel(member?.id, memberChannel.id);
    return memberChannel;

  } catch (error) {
    throw error;
  }
}

async function moveToActiveCategory(memberId: string, voiceChannel: VoiceChannel): Promise<VoiceChannel> {
  const guild = voiceChannel.guild;
  const activeCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

  await voiceChannel.setParent(activeCategory, { lockPermissions: false });
  await voiceChannel.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false })

  addActiveVoiceChannel(memberId, voiceChannel.id);

  return voiceChannel;
}

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => { 
    if (oldState.channel) return;
    
    if (newState.channelId != voiceChannelId) return;
    
    const member = newState.member;

    const savedChannelId = await isVoiceChannelSaved(member as GuildMember);
    if (savedChannelId) {
      const voiceChannel = member?.guild?.channels.cache.get(savedChannelId as string) as VoiceChannel;
      moveToActiveCategory(member?.id as string, voiceChannel)
        .then((channel) => {
          member?.voice
            .setChannel(channel)
            .catch(() => { return; })
        })

      return;
    }

    createVoiceChannel(newState)
      .then(channel => {
        member?.voice
          .setChannel(channel)
          .catch(() => { return; });
      })
      .catch(console.error)
  }
}