import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ContextMenuCommandInteraction } from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("allow")
    .setDefaultMemberPermissions('0')
    .setType(2), // 2 = USER (@TODO: Types not being resolved)
  async execute(interaction: ContextMenuCommandInteraction) {
    console.log("Allowing user");
  }
}