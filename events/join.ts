import { CategoryChannel, VoiceState } from "discord.js"
import { ChannelTypes } from "discord.js/typings/enums";

import { voiceChannelId, categoryId } from "../config.json";

async function createVoiceChannel(voiceState: VoiceState) {
  const guild = voiceState.guild;
  const member = voiceState.member;

  const channelCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

  const memberChannel = await channelCategory.createChannel(member?.displayName || "Channel", {
    type: ChannelTypes.GUILD_VOICE,
    userLimit: 0
  });

  return memberChannel;
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
  }
}