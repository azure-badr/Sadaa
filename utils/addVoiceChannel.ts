import { createClient } from "redis";

export async function addActiveVoiceChannel(voiceChannelId: string): Promise<void> {
  const client = createClient();
  await client.connect();

  await client.sAdd("voice_channels", voiceChannelId);

  await client.disconnect()
}
