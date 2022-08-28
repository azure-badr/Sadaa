import { DiscordAPIError } from "discord.js";
import { CategoryChannel, VoiceChannel, VoiceState } from "discord.js";


import {
  isVoiceChannelSaved,
  isVoiceChannelActive,
  deleteActiveVoiceChannel,
  removeVoiceChannelFromHashWithVcId
} from "../utils/vc";

import { idleCategoryId } from "../config";

async function removeFromSavedState(channelId: string) {
  await deleteActiveVoiceChannel(channelId);
  await removeVoiceChannelFromHashWithVcId(channelId);
}

async function moveToIdleCategory(voiceChannel: VoiceChannel) {
  await deleteActiveVoiceChannel(voiceChannel.id);
  
  try {
    await voiceChannel.permissionOverwrites.edit(voiceChannel.guild.roles.everyone, {
      VIEW_CHANNEL: false,
    })
    
    const category = voiceChannel.guild.channels.cache.get(idleCategoryId) as CategoryChannel;
    await voiceChannel.setParent(category, {
      lockPermissions: false,
    });
  } catch (error) {}
}

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    const channel = oldState.channel;
    if (channel?.members.size !== 0) 
      return
    
    if (!(await isVoiceChannelActive(oldState.channelId)))
      return;
    
    if (await isVoiceChannelSaved(channel.id)) {
      await moveToIdleCategory(channel as VoiceChannel);
      return;
    }

    channel.delete()
      .then(async () => {
        await removeFromSavedState(channel.id as string);
      })
      .catch((error: DiscordAPIError) => {
        if (error.message === "Unknown Channel")
          return;
      })

  }
}
