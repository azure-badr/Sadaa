import { DiscordAPIError } from "@discordjs/rest";
import { VoiceState } from "discord.js";
import { isVoiceChannelActive, deleteActiveVoiceChannel } from "../utils/vc";

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    const channel = oldState.channel;
    if (channel?.members.size !== 0) 
      return
    
    if (!(await isVoiceChannelActive(oldState.channelId)))
      return;

    channel.delete()
      .then(async () => await deleteActiveVoiceChannel(oldState.channelId))
      .catch((error: DiscordAPIError) => {
        if (error.message === "Unknown Channel")
          return;
      })

  }
}
