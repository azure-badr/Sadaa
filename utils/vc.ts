import { createClient } from "redis";

export async function addActiveVoiceChannel(voiceChannelId: string): Promise<void> {
  const client = createClient();
  await client.connect();

  await client.sAdd("voice_channels", voiceChannelId);

  await client.disconnect()
}

export async function getActiveVoiceChannels(): Promise<Array<string>> {
  const client = createClient();
  await client.connect();

  const voiceChannels = await client.sMembers("voice_channels");

  await client.disconnect()

  return voiceChannels;
}
