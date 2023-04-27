import { GuildMember, VoiceChannel } from "discord.js";
import { getVoiceChannelFromHash, removeSavedVoiceChannel, removeVoiceChannelFromHashWithVcId } from "../utils/vc";

export default {
  name: "guildMemberAdd",
  once: false,
  execute: async (member: GuildMember) => {
    const voiceChannelId = await getVoiceChannelFromHash(member.id);
    if (!voiceChannelId) return;

    const guild = member.guild;
    const voiceChannel = guild.channels.cache.get(voiceChannelId) as VoiceChannel;

    // If the voice channel ID exists on the hash, but the voice channel doesn't exist, 
    // remove the voice channel ID from the hash
    if (!voiceChannel) {
      await removeVoiceChannelFromHashWithVcId(voiceChannelId);
      await removeSavedVoiceChannel(voiceChannelId);
      return;
    }
  }
}