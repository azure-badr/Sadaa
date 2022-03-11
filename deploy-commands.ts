import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"

import { applicationId, guildId, token } from "./config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("slash")
    .setDescription("Slash command")
]
  .map(command => command.toJSON())

const rest = new REST({ version: '9' })
  .setToken(token);

rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands })
  .then(() => console.log("Successfully deployed commands"))
  .catch(console.error);
