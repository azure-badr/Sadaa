import { CategoryChannel, VoiceState } from "discord.js"
import { ChannelTypes } from "discord.js/typings/enums";

import {
  applicationId,
  voiceChannelId,
  categoryId,
  defaultUserLimit,
  defaultBitrate
} from "../config.json";
import { addActiveVoiceChannel } from "../utils/vc";

async function createVoiceChannel(voiceState: VoiceState) {
  const client = voiceState.client;
  const guild = voiceState.guild;
  const member = voiceState.member;

  const channelCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

  try {
    const memberChannel = await channelCategory.createChannel(member?.displayName || "Channel", {
      type: ChannelTypes.GUILD_VOICE,
      bitrate: defaultBitrate,
      userLimit: defaultUserLimit,
      permissionOverwrites: [
        // Overwrite for client
        {
          id: applicationId,
          allow: ["VIEW_CHANNEL"],
          deny: ["CREATE_INSTANT_INVITE"] // Indication of a saved voice channel
        },
        // Overwrite for user
        {
          id: member?.id || '',
          allow: [
            "MANAGE_CHANNELS",
            "VIEW_CHANNEL",
            "CONNECT",
            "SPEAK", 
            "MUTE_MEMBERS", 
            "DEAFEN_MEMBERS", 
            "MOVE_MEMBERS",
          ],
        }
      ]
    });
    
    // Add voice channel to redis server
    addActiveVoiceChannel(memberChannel.id);
    return memberChannel;

  } catch (error) {
    throw error;
  }
}

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => { 
    if (oldState.channel) return;
    
    if (newState.channelId != voiceChannelId) return;
    
    const member = newState.member;

    createVoiceChannel(newState)
      .then(channel => {
        member?.voice.setChannel(channel)
          .catch(console.error);
      })
      .catch(console.error)
  }
}