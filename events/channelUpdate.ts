import { PermissionFlagsBits } from "discord-api-types/v9"
import { GuildChannel } from "discord.js"
import { mehmaanChannelId } from "../config"

export default {
  name: "channelUpdate",
  execute: async (oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> => {
    // Check if permissions for Mehmaan channel is changed, then revert it
    const newMehmaanPermissionOverwrites =
      newChannel.permissionOverwrites.cache.get(mehmaanChannelId);
    
    if (!newMehmaanPermissionOverwrites) {
      newChannel.permissionOverwrites.edit(mehmaanChannelId, {
        VIEW_CHANNEL: false
      });
      return
    }
    
    if (newMehmaanPermissionOverwrites?.allow.has(PermissionFlagsBits.ViewChannel)) {
      await newMehmaanPermissionOverwrites.edit({
        VIEW_CHANNEL: false
      });
    }
  },
}