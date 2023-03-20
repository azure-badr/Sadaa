import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ContextMenuInteraction } from "discord.js";

export default interface ContextMenuObject {
  data: ContextMenuCommandBuilder;
  execute: (interaction: ContextMenuInteraction) => Promise<void>;
}