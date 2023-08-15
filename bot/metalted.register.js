import 'dotenv/config';
import { commands } from './metalted.command.js';
import { InstallGlobalCommands } from './utils.js';

function InstallCommands()
{
    //Get all the commands
    const commandArray = [];
    const commandKeys = Object.keys(commands);
    commandKeys.forEach((ck) =>
    {
        commandArray.push(commands[ck].command());
    });
    console.log(commandArray);
    InstallGlobalCommands(process.env.APP_ID, commandArray);
}

InstallCommands();