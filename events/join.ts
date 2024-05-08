import { CategoryChannel, ChannelType, DiscordAPIError, DiscordErrorData, GuildMember, VoiceChannel, VoiceState } from "discord.js"

import {
  voiceChannelId,
  categoryId,
  modRoleId,
  defaultUserLimit,
  defaultBitrate
} from "../config";
import { addActiveVoiceChannel, isVoiceChannelSaved } from "../utils/vc";
import { PermissionFlagsBits } from "discord.js";

async function createVoiceChannel(voiceState: VoiceState, name?: string) {
  const guild = voiceState.guild;
  const member = voiceState.member as GuildMember;

  try {
    const channelCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

    const memberChannel = await guild.channels.create({
      name: name || `${member?.displayName}'s VC`,
      type: ChannelType.GuildVoice,
      bitrate: defaultBitrate,
      userLimit: defaultUserLimit,
      permissionOverwrites: [
        {
          id: member?.id,
          allow: [
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers,
            PermissionFlagsBits.MoveMembers,
          ],
        },
        {
          id: modRoleId,
          allow: [PermissionFlagsBits.ManageChannels],
        },
      ],
      parent: channelCategory,
    });
    
    addActiveVoiceChannel(member?.id, memberChannel.id);
    return memberChannel;

  } catch (error: any) {
    throw error;
  }
}

async function moveToActiveCategory(memberId: string, voiceChannel: VoiceChannel): Promise<VoiceChannel> {
  const guild = voiceChannel.guild;
  const activeCategory = guild.channels.cache.get(categoryId) as CategoryChannel;

  await voiceChannel.setParent(activeCategory, { lockPermissions: false });
  await voiceChannel.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: true })

  addActiveVoiceChannel(memberId, voiceChannel.id);

  return voiceChannel;
}

export default {
  name: "voiceStateUpdate",
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => { 
    if (oldState.channel) return;
    
    if (newState.channelId != voiceChannelId) return;

    const member = newState.member;
    console.log(`[Join] Member {${member?.displayName}} joined to create a VC`)
    
    const savedChannelId = await isVoiceChannelSaved(member as GuildMember);
    if (savedChannelId) {
      const voiceChannel = member?.guild?.channels.cache.get(savedChannelId as string) as VoiceChannel;
      moveToActiveCategory(member?.id as string, voiceChannel)
        .then((channel) => {
          member?.voice
            .setChannel(channel)
            .catch(() => { return; })
        })

      return;
    }

    createVoiceChannel(newState)
      .then(channel => {
        member?.voice
          .setChannel(channel)
          .catch(() => { return; })
      })
      .catch(async (error) => {
        if (!(error instanceof DiscordAPIError)) return;

        // If VC name contains words not allowed for servers in Server Discovery.
        // Yeah, there's no way around this. This is how you do it..
        const errors = error.rawError as any;
        if (errors.errors.name._errors[0].code == "INVALID_COMMUNITY_PROPERTY_NAME") {
          console.log(`[Join] Member {${member?.displayName}} tried to create a VC with a name that is not allowed.`)
          const channel = await createVoiceChannel(newState, "Your VC");
          member?.voice
            .setChannel(channel)
            .catch(() => { return; })
        }
      });
  }
}