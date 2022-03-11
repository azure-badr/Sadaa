import { VoiceState } from "discord.js"

import { voiceChannelId } from "../config.json";

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => { 
    if (oldState.channel) return;
    
    if (newState.channelId != voiceChannelId) return;
    
    const guild = newState.guild;
    const member = newState.member;

    console.log(member?.id)
  }
}