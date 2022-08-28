import path from "path";
import { readdirSync } from "fs";
import { token } from "./config.js";

import SlashCommandObject from "./models/SlashCommandObject";
import EventObject from "./models/EventObject";

import { Client, Collection, Intents } from "discord.js";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES, 
  ]
})

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

// Commands
const commands = new Collection<string, SlashCommandObject>();

const commandFiles = readdirSync(path.join(__dirname, "/commands/")).filter(file => file);

commandFiles.forEach(file => {
  const command: SlashCommandObject = require(`./commands/${file}`).default;
  commands.set(command.data.name, command);
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

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
})

client.login(token);
