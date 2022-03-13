import { Channel } from "discord.js";
import { deleteActiveVoiceChannel, isVoiceChannelActive } from "../utils/vc";

export default {
  name: "channelDelete",
  once: false,
  execute: async (channel: Channel) => {
    if (!channel.isVoice())
      return

    if (!(await isVoiceChannelActive(channel.id)))
      return;

    await deleteActiveVoiceChannel(channel.id)
  }
}