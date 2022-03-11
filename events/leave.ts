import { VoiceState } from "discord.js";
import { isVoiceChannelActive, deleteActiveVoiceChannel } from "../utils/vc";

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    if (newState.channel) return;
    
    if (!(await isVoiceChannelActive(oldState.channelId)))
      return;

    const channel = oldState.channel;
    if (channel?.members.size !== 0) 
      return
    
    channel.delete()
      .then(async () => await deleteActiveVoiceChannel(oldState.channelId))
  }
}
