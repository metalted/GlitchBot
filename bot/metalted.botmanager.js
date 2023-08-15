import * as builder from './metalted.builder.js';
import * as command from './metalted.command.js';
import * as application from './metalted.application.js';

export const HandleInteraction = (request) =>
{   
    switch(request.body.type)
    {
        case 1:
            console.log("");
            console.log("Ping-Pong");
            return { type: 1 };
        case 2:
            return HandleApplicationCommand(request);
        case 3:
            return HandleMessageComponent(request);
        case 4: 
            console.log("");
            console.log("Application Command AutoComplete");            
            return HandleApplicationCommandAutocomplete(request);
        case 5: 
            console.log("");
            console.log("Modal Submit");
            return HandleModalSubmit(request);
    }
};

export const HandleApplicationCommand = (request) =>
{
    const cmd = request.body.data.name;
    console.log("\n- Received application command: " + cmd);
    
    //Check if this is a valid command.
    const validCommand = cmd in command.commands;

    //This shouldnt happen because all commands are registered, but just in case.
    if(!validCommand){
        console.log("- Invalid command.");
        return builder.ChatMessage("Invalid Command");
    }    
    
    //Does this command have an associated application?
    if(command.commands[cmd].hasOwnProperty('app'))
    {
        console.log("- Commandtype: Application.");

        //Is this user present in the registry?
        if(application.IsRegistered(request))
        {
            console.log("- User is registered for applications.");

            //This user is already present in the registry, check if they have the requested application already loaded.
            const loadedApp = application.GetLoadedApplication(request);

            if(loadedApp != null)
            {
                console.log("- Application with same name is already loaded. Unloading...");
                
                //The same application is already loaded, so unload it first. (True means its a reloading);
                loadedApp.exit(true);            
            }
        }

        //Load the application with the given name for this user.
        const app = application.LoadApplication(request, cmd);
        console.log(`- Loaded application ${app.applicationName} for user ${app.user.username}.`);

        //Return the response of the application.
        return app.parse(request, false);
    }
    //Does this command have an associated response?
    else if(command.commands[cmd].hasOwnProperty('response'))
    {
        console.log("- Commandtype: Response.");
        return command.commands[cmd].response(request);
    }
    //This command is not configured correctly.
    else
    {
        console.log("- Incorrectly configured command.");
        return builder.ChatMessage(`Command _${cmd}_ is not configured correctly. Please make sure there is an application or response defined.`);
    }
};

export const HandleMessageComponent = (request) =>
{
    //An interaction occured with a component, get the id of that component.
    const customIdData = request.body.data.custom_id.split('|');
  
    if(customIdData.length != 2)
    {
       return builder.ChatMessage("Custom id is in wrong format");
    }
    else
    {
      const applicationId = customIdData[0];
      const component = customIdData[1];
      const userId = request.body.member.user.id;
      console.log(`\n- Received interaction with applicationID ${applicationId} on component ${component} from user ${userId}`);
      
      const userInteractionSystem = application.GetUserInteractionSystem(request);
      if(userInteractionSystem == null)
      {
          console.log('- Interaction belongs to an unregistered user.');
          return builder.ChatMessage("Unregistered user interaction.");
      }
      else
      {
         //Get the app that has the given applicationId.
         let app = null;
         const appKeys = Object.keys(userInteractionSystem.apps);
         appKeys.forEach((ak) => {
             if(userInteractionSystem.apps[ak].applicationId == applicationId)
             {
               app = userInteractionSystem.apps[ak];
             }
         });
        
        if(app == null)
        {
            console.log('- Interaction not found or is expired.');
            return builder.ChatMessage("Application not found for this interaction.");
        }
        else
        {
            return app.parse(request, true);  
        }
      }
    }
};

export const HandleApplicationCommandAutocomplete = (request) =>
{
    return builder.ChatMessage("Not Implemented");
};

export const HandleModalSubmit = (request) =>
{
    return builder.ChatMessage("Not Implemented");
}