import { PermissionFlagsBits } from "discord-api-types/v9"
import { GuildChannel } from "discord.js"
import { mehmaanChannelId, categoryId } from "../config"

export default {
  name: "channelUpdate",
  execute: async (oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> => {
    if (oldChannel.parentId !== categoryId)
      return
  },
}