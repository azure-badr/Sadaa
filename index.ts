import path from "path";
import { readdirSync } from "fs";
import { token } from "./config";

import SlashCommandObject from "./models/SlashCommandObject";
import EventObject from "./models/EventObject";

import { Client, Collection, GatewayIntentBits } from "discord.js";
import ContextMenuObject from "./models/ContextMenuObject";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

// Events
const eventFiles = readdirSync(path.join(__dirname, "/events/")).filter(file => file);
eventFiles.forEach(file => {
  const event: EventObject = require(`./events/${file}`).default;
  if (event.once) {
    client.once(event.name, (...args: [any]) => event.execute(...args));
    return;
  }

  client.on(event.name, (...args: [any]) => event.execute(...args));
})

// Commands & Context Menus
const commands = new Collection<string, SlashCommandObject>();
const contextMenus = new Collection<string, ContextMenuObject>();

const commandFiles = readdirSync(path.join(__dirname, "/commands/")).filter(file => file);
const contextMenuFiles = readdirSync(path.join(__dirname, "/context_menus/")).filter(file => file);

commandFiles.forEach(file => {
  const command: SlashCommandObject = require(`./commands/${file}`).default;
  commands.set(command.data.name, command);
});

contextMenuFiles.forEach(file => {
  const contextMenu: ContextMenuObject = require(`./context_menus/${file}`).default;
  contextMenus.set(contextMenu.data.name, contextMenu);
});

client.on("interactionCreate", async interaction => {
  if (interaction.isCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occured while executing this command", ephemeral: true
      });
    }
  }

  if (interaction.isUserContextMenuCommand()) {
    const contextMenu = contextMenus.get(interaction.commandName);
    if (!contextMenu) return;

    try {
      await contextMenu.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occured while executing this interaction", ephemeral: true
      });
    }
  }

  if (interaction.isModalSubmit()) {
    const modalHandler = require(`./events/modalHandle`).default;
    try {
      await modalHandler.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occured while executing this interaction", ephemeral: true
      });
    }
  }
})

client.login(token);
