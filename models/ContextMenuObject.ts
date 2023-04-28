import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ContextMenuCommandInteraction } from "discord.js";

export default interface ContextMenuObject {
  data: ContextMenuCommandBuilder;
  execute: (interaction: ContextMenuCommandInteraction) => Promise<void>;
}