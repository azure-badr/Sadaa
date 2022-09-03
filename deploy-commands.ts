import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { readdirSync } from "fs";
import path from "path";

import { applicationId, guildId, token } from "./config";
import SlashCommandObject from "./models/SlashCommandObject";

const commandFiles = readdirSync(path.join(__dirname, "/commands/")).filter(file => file);
const commands: Array<SlashCommandBuilder> = [];

commandFiles.forEach(file => {
  const { data: command } = require(`./commands/${file}`).default as SlashCommandObject;
  commands.push(command);
})

const rest = new REST({ version: '9' })
  .setToken(token);

rest.put(Routes.applicationGuildCommands(applicationId, guildId),
  {
    body: commands.map(command => command.toJSON())
  })
  .then(() => console.log("Successfully deployed commands"))
  .catch(console.error);
