import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ContextMenuInteraction } from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("kick")
    .setDefaultPermission(false)
    .setType(2), // 2 = USER (@TODO: Types not being resolved)
  async execute(interaction: ContextMenuInteraction) {
    console.log("Kicking user");
  }
}