import { Channel } from "discord.js";
import { deleteActiveVoiceChannel, removeSavedVoiceChannel } from "../utils/vc";

export default {
  name: "channelDelete",
  once: false,
  execute: async (channel: Channel) => {
    if (!channel.isVoice())
      return

    await deleteActiveVoiceChannel(channel.id);
    await removeSavedVoiceChannel(channel.id);
  }
}