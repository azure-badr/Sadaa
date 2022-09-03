import { Channel } from "discord.js";
import { deleteActiveVoiceChannel, removeSavedVoiceChannel, removeVoiceChannelFromHashWithVcId } from "../utils/vc";

export default {
  name: "channelDelete",
  once: false,
  execute: async (channel: Channel) => {
    if (!channel.isVoice())
      return

    await deleteActiveVoiceChannel(channel.id);
    await removeSavedVoiceChannel(channel.id);

    await removeVoiceChannelFromHashWithVcId(channel.id);
  }
}