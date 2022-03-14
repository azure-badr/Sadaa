import { CategoryChannel, GuildMember, VoiceChannel, VoiceState } from "discord.js"
import { ChannelTypes } from "discord.js/typings/enums";

import {
  voiceChannelId,
  categoryId,
  defaultUserLimit,
  defaultBitrate
} from "../config.json";
import { addActiveVoiceChannel, isVoiceChannelSaved } from "../utils/vc";

async function createVoiceChannel(voiceState: VoiceState) {
  const guild = voiceState.guild;
  const member = voiceState.member as GuildMember;

  const channelCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

  try {
    const memberChannel = await channelCategory.createChannel(member?.displayName || "Channel", {
      type: ChannelTypes.GUILD_VOICE,
      bitrate: defaultBitrate,
      userLimit: defaultUserLimit,
      permissionOverwrites: [
        {
          id: member?.id,
          allow: [
            "MANAGE_CHANNELS",
            "CONNECT",
            "SPEAK", 
            "MUTE_MEMBERS", 
            "DEAFEN_MEMBERS", 
            "MOVE_MEMBERS",
          ],
        }
      ]
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
  await voiceChannel.permissionOverwrites.edit(guild.roles.everyone, { VIEW_CHANNEL: true })

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