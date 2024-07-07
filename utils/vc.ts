import { GuildMember, VoiceChannel } from "discord.js";
import { createClient } from "redis";

import { redisPassword, redisHost, redisPort, REDIS_URL } from "../config";

const client = createClient({
  url: REDIS_URL
});
client.connect()
  .then(() => console.log("Redis client connected"))
  .catch(err => console.error(err));

// @ts-ignore
client.on("error", (error) => {
  console.error(error);
});

export async function addActiveVoiceChannel(memberId: string, voiceChannelId: string): Promise<void> {
  await client.sAdd("voice_channels", voiceChannelId);
  await client.hSet("voice_channel_members", memberId, voiceChannelId);
}

export async function getVoiceChannelFromHash(memberId: string): Promise<string | undefined> {
  const voiceChannelId = await client.hGet("voice_channel_members", memberId);
  return voiceChannelId;
}

export async function removeVoiceChannelFromHash(memberId: string): Promise<void> {
  await client.hDel("voice_channel_members", memberId);
}

export async function getVoiceChannelFromHashWithVcId(voiceChannelId: string): Promise<string | undefined> {
  const memberVoiceChannels: any = await client.hGetAll("voice_channel_members");
  Object.keys(memberVoiceChannels).forEach(async memberId => {
    if (memberVoiceChannels[memberId] === voiceChannelId)
      return memberId;
  });

  return undefined;
}

export async function removeVoiceChannelFromHashWithVcId(voiceChannelId: string): Promise<void> {
  const memberVoiceChannels: any = await client.hGetAll("voice_channel_members");
  Object.keys(memberVoiceChannels).forEach(async memberId => {
    if (memberVoiceChannels[memberId] === voiceChannelId)
      await client.hDel("voice_channel_members", memberId);
  });
}

export async function deleteActiveVoiceChannel(voiceChannelId: string | any): Promise<void> {
  await client.sRem("voice_channels", voiceChannelId);
}

export async function getActiveVoiceChannels(): Promise<Array<string>> {
  const voiceChannels = await client.sMembers("voice_channels");
  return voiceChannels;
}

export async function isVoiceChannelActive(voiceChannelId: string | any): Promise<boolean> {
  return (await getActiveVoiceChannels()).includes(voiceChannelId);
}

export async function isVoiceChannelSaved(voiceChannelId: string | GuildMember): Promise<boolean | string> {
  if (typeof voiceChannelId === "string")
    return (await client.sMembers("saved_voice_channels")).includes(voiceChannelId);

  return await getVoiceChannelFromHash(voiceChannelId.id) as string;
}

export async function saveVoiceChannel(voiceChannelId: string): Promise<void> {
  if (await isVoiceChannelSaved(voiceChannelId)) return;

  await client.sAdd("saved_voice_channels", voiceChannelId);
}

export async function removeSavedVoiceChannel(voiceChannelId: string): Promise<void> {
  if (await isVoiceChannelSaved(voiceChannelId)) {
    await removeVoiceChannelFromHashWithVcId(voiceChannelId);
    await client.sRem("saved_voice_channels", voiceChannelId);
  }
}
