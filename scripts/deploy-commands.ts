import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { readdirSync } from "fs";
import path from "path";

import { applicationId, guildId, token } from "../config";
import ContextMenuObject from "../models/ContextMenuObject";
import SlashCommandObject from "../models/SlashCommandObject";

console.log("Deploying commands...");
console.log(`Application ID: ${applicationId}`);

const commandFiles = readdirSync(path.join(__dirname, "../commands/")).filter(file => file);
const commands: Array<SlashCommandBuilder> = [];

const contextMenuFiles = readdirSync(path.join(__dirname, "../context_menus/")).filter(file => file);
const contextMenus: Array<ContextMenuCommandBuilder> = [];


commandFiles.forEach(file => {
  const { data: command } = require(path.join(__dirname, `../commands/${file}`)).default as SlashCommandObject;
  commands.push(command);
})

contextMenuFiles.forEach(file => {
  const { data: contextMenu } = require(path.join(__dirname, `../context_menus/${file}`)).default as ContextMenuObject;
  contextMenus.push(contextMenu);
});

const rest = new REST({ version: '9' })
  .setToken(token);

rest.put(Routes.applicationGuildCommands(applicationId, guildId),
  {
    body: [...commands, ...contextMenus].map(command => command.toJSON())
  })
  .then(() => console.log("Successfully deployed commands"))
  .catch(console.error);