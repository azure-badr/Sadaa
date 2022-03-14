import { GuildMember, VoiceChannel } from "discord.js";
import { createClient } from "redis";

import { applicationId } from "../config.json";

export async function isVoiceChannelSaved(voiceChannel: VoiceChannel): Promise<boolean | undefined> {
  
  /*
  This function is used to check if a voice channel is saved by 
  checking if a voice channel has CREATE_INSTANT_INVITE permissions. 
  Everytime a voice channel is saved, it will enable CREATE_INSTANT_INVITE permission
  for the bot to indicate that the channel is saved
  */
  
  const client = voiceChannel.guild.members.cache.get(applicationId) as GuildMember;
  const permission = voiceChannel.permissionsFor(client.id);

  return permission?.has("CREATE_INSTANT_INVITE");
}

export async function addActiveVoiceChannel(memberId: string, voiceChannelId: string): Promise<void> {
  const client = createClient();
  await client.connect();

  await client.sAdd("voice_channels", voiceChannelId);
  await client.hSet("voice_channel_members", memberId, voiceChannelId);

  await client.disconnect()
}

export async function getVoiceChannelFromHash(memberId: string): Promise<string | undefined> {
  const client = createClient();
  await client.connect();

  const voiceChannelId = await client.hGet("voice_channel_members", memberId);

  await client.disconnect()

  return voiceChannelId;
}

export async function removeVoiceChannelFromHash(memberId: string): Promise<void> {
  const client = createClient();
  await client.connect();

  await client.hDel("voice_channel_members", memberId);

  await client.disconnect()
}

export async function deleteActiveVoiceChannel(voiceChannelId: string | any): Promise<void> {
  const client = createClient();
  await client.connect();

  await client.sRem("voice_channels", voiceChannelId);

  await client.disconnect()
}

export async function getActiveVoiceChannels(): Promise<Array<string>> {
  const client = createClient();
  await client.connect();

  const voiceChannels = await client.sMembers("voice_channels");

  await client.disconnect()

  return voiceChannels;
}

export async function isVoiceChannelActive(voiceChannelId: string | any): Promise<boolean> {
  return (await getActiveVoiceChannels()).includes(voiceChannelId);
}
