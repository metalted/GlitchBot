import * as builder from './metalted.builder.js';
import { commands } from './metalted.command.js';

//The registry will contain all the interactions stored under userId : {user: {} , system : {} }
const registry = {};

//Is the user registered in the registry.
export const IsRegistered = (request) =>
{
    return request.body.member.user.id in registry;
};

//Register the user from this request in the registry.
export const Register = (request) =>
{
    //If the user is not present in the registry
    if(!(request.body.member.user.id in registry))
    {
        //Add the user to the registry with a new UserInteractionSystem.
        registry[request.body.member.user.id] = 
        {
            user : request.body.member.user,
            system : UserInteractionSystem(request)
        }

        console.log("- Registered new user: " + request.body.member.user.username);
    }
  
    //Return the registered user.
    return registry[request.body.member.user.id].system;
}

//Unregister the user from the registry.
export const Unregister = (registryID) =>
{
    //If the user is found in the registry, remove it.
    if( registryID in registry )
    {
        delete registry[registryID];
        console.log(`- Removed ${registryID} from registry.`);
    }
}

//Get the users interaction system, if present. Otherwise return null.
export const GetUserInteractionSystem = (request) =>
{
    if(IsRegistered(request))
    {
        return registry[request.body.member.user.id].system;
    }
    else
    {
      return null;
    }    
}

//Load an application with the given name into the user register.
export const LoadApplication = (request, applicationName) =>
{
    //Registering returns the user system.
    const userInteractionSystem = Register(request);
    //Create the app through the commands object, this will automatically boot it and assign it to the user.
    let app = commands[applicationName].app(request, userInteractionSystem);
    //Return the loaded application.
    return app;
};

//This function will return the application belonging to this request's application name.
export const GetLoadedApplication = (request) =>
{
    //Get the name of the application from the request. This is the used slash command.
    const requestedApplication = request.body.data.name;
    //Use the user id from the request, to return the running apps of the current user.
    const userApps = registry[request.body.member.user.id].system.apps;
    //Convert the apps object keys to an array.
    const applicationIds = Object.keys(userApps);
    
    //Create a variable to hold the loaded application.
    let loadedApp = null;
    //Go over all application ids.
    applicationIds.forEach((applicationId) =>
    {
        //If this applications name matches the request name.
        if(userApps[applicationIds].applicationName == requestedApplication)
        {
          //This is the loaded app to return.
            loadedApp = userApps[applicationId];
        }
    });

    //Return the loaded app, or if not found return null.
    return loadedApp;
}

//The user interaction system module. Creates an object that will keep track of a users loaded applications.
//Allows for loading and unloading applications and destroying itself from the registry.
export const UserInteractionSystem = (request) =>
{
    return {
        user: request.body.member.user,
        registryID: request.body.member.user.id,
        apps : {},
        destroy: function(){ Unregister(this.registryID); },
        load : function(app)
        {
            const applicationId = app.applicationId;
            if(applicationId != null)
            {
                this.apps[applicationId] = app;
            }
        },
        unload : function(app, isReload)
        {          
            const applicationId = app.applicationId;
            if(applicationId != null)
            {
                if(applicationId in this.apps)
                {
                    console.log(`- Unloading application ${applicationId} for user ${this.user.id}`);
                    delete this.apps[applicationId];
                }
            }
          
            if(Object.keys(this.apps).length == 0)
            {
                //If the application is actually exited, instead of being reloaded because of a duplicate.
                if(!isReload)
                {
                   this.destroy();
                }
            }
        }
    }
}

//The base for each application. When creating a new application this will be the base of it.
//Then overwrite or add functionality to the object, like overwriting the parsing.
//Boot will be called automatically to assign the application the calling user.
//Exit can be called to stop the application from running an remove it from the user.
export const Application = (request, userInteractionSystem) =>
{   
    const baseApp =  {
        userInteractionSystem : null,
        applicationId : null,
        applicationName : '',
        user : null,
        //Booting up will set all required variables for the system to work.
        boot : function(request, userInteractionSystem)
        {
            //Set our variables.
            this.userInteractionSystem = userInteractionSystem;
            this.applicationId = request.body.id;
            this.applicationName = request.body.data.name;
            this.user = request.body.member.user;
            this.userInteractionSystem.load(this);            
        },        
        parse : function(request, isComponent)
        {
            //Parse the request
            return builder.ChatMessage("This application has no further parsing defined!");
        },
        exit : function(isReload = false)
        {
            //Remove the app from the interaction system.
            userInteractionSystem.unload(this, isReload); 
        }
    };

    baseApp.boot(request, userInteractionSystem);
    return baseApp;
}