export const MessageBuilder = (request, interactionId = null) =>
{
    return {
        request : request,
        interactionId : interactionId == null ? request.body.data.id : interactionId,
        message : CreateMessage(""),
        content : "",
        actionRows : [null, null, null, null, null],
        UpdateMessage : function()
        {
            this.message = CreateMessage(this.content);     
             
            this.actionRows.forEach((ar) => {
                if(ar != null)
                {
                    this.message.data.components.push(ar);
                }
            }); 
        },
        SetContent : function(content)
        {
            this.content = content;
        },   
        //Primary buttons are blurple.
        AddPrimaryButton : function(row, label, disabled = false, emoji = null)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Go over the components in the action row, we can only add a button if there are 4 or less buttons and no other component types.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons == 5 || componentCount.others > 0)
            {
                console.log('Cant add button because action row is either occupied or full!');
            }
            else
            {
                let button = CreateButton(label, `${this.interactionId}|${label.toLowerCase()}`, 1, emoji, "", disabled);
                this.actionRows[row].components.push(button);         
            }             
        
            this.UpdateMessage();
        },
        //Secondary buttons are grey.
        AddSecondaryButton : function(row, label, disabled = false, emoji = null)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Go over the components in the action row, we can only add a button if there are 4 or less buttons and no other component types.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons == 5 || componentCount.others > 0)
            {
                console.log('Cant add button because action row is either occupied or full!');
            }
            else
            {
                let button = CreateButton(label, `${this.interactionId}|${label.toLowerCase()}`, 2, emoji, "", disabled);
                this.actionRows[row].components.push(button);         
            }             
        
            this.UpdateMessage();
        },
        //Success buttons are green.
        AddSuccessButton : function(row, label, disabled = false, emoji = null)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Go over the components in the action row, we can only add a button if there are 4 or less buttons and no other component types.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons == 5 || componentCount.others > 0)
            {
                console.log('Cant add button because action row is either occupied or full!');
            }
            else
            {
                let button = CreateButton(label, `${this.interactionId}|${label.toLowerCase()}`, 3, emoji, "", disabled);
                this.actionRows[row].components.push(button);         
            }             
        
            this.UpdateMessage();
        },
        //Danger buttons are red.
        AddDangerButton : function(row, label, disabled = false, emoji = null)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Go over the components in the action row, we can only add a button if there are 4 or less buttons and no other component types.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons == 5 || componentCount.others > 0)
            {
                console.log('Cant add button because action row is either occupied or full!');
            }
            else
            {
                let button = CreateButton(label, `${this.interactionId}|${label.toLowerCase()}`, 4, emoji, "", disabled);
                this.actionRows[row].components.push(button);         
            }             
        
            this.UpdateMessage();
        },
        //Danger buttons are red.
        AddLinkButton : function(row, label, url)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Go over the components in the action row, we can only add a button if there are 4 or less buttons and no other component types.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons == 5 || componentCount.others > 0)
            {
                console.log('Cant add button because action row is either occupied or full!');
            }
            else
            {
                this.actionRows[row].components.push(CreateButton(label, `${this.interactionId}|${label.toLowerCase()}`, 5, null, url, false));         
            }             
        
            this.UpdateMessage();
        },
        AddSelectionList : function(row, label, options = [])
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Get the component count to check if we can add it.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons > 0 || componentCount.others > 0)
            {
                console.log('Cant add selection list because action row is occupied!');
            }
            else
            {
                this.actionRows[row].components.push(CreateSelectionList(`${this.interactionId}|${label.toLowerCase()}`, options)); 
            }            
            
            this.UpdateMessage();
        },
        AddOption : function(row, label, value = "", description = "", emoji = null)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, cant add option.
            if(this.actionRows[row] == null)
            {
                console.log('Cant add option because no action row is present.');
            }
            else
            {
                //Get the component count to check if a select is present.
                const componentCount = GetComponentCount(this.actionRows[row]);

                if(componentCount.select == 1)
                {
                    let option = CreateOption(label, value, description, emoji);
                    this.actionRows[row].components[0].options.push(option);
                }
                else
                {
                    console.log('Cant add option because there is no select in this action row.');
                }
            }

            this.UpdateMessage();
        },
        AddUserSelect : function(row, label){ this.AddPrefilledList(row, label, 5); },
        AddRoleSelect : function(row, label){ this.AddPrefilledList(row, label, 6); },
        AddMentionableSelect : function(row, label){ this.AddPrefilledList(row, label, 7); },
        AddChannelSelect : function(row, label){ this.AddPrefilledList(row, label, 8); },
        AddPrefilledList : function(row, label, type)
        {
            if(row < 0 || row > 4){ console.log('Invalid row'); return; }

            //If the current action row is null, create a new action row.
            if(this.actionRows[row] == null)
            {
                this.actionRows[row] = CreateActionRow();
            }

            //Get the component count to check if we can add it.
            const componentCount = GetComponentCount(this.actionRows[row]);

            if(componentCount.buttons > 0 || componentCount.others > 0)
            {
                console.log('Cant add list because action row is occupied!');
            }
            else
            {
                switch(type)
                {
                    case 5:
                        this.actionRows[row].components.push(CreateUserSelect(`${this.interactionId}|${label.toLowerCase()}`));                         
                        break;
                    case 6:
                        this.actionRows[row].components.push(CreateRoleSelect(`${this.interactionId}|${label.toLowerCase()}`)); 
                        break;
                    case 7:
                        this.actionRows[row].components.push(CreateMentionableSelect(`${this.interactionId}|${label.toLowerCase()}`)); 
                        break;
                    case 8:
                        this.actionRows[row].components.push(CreateChannelSelect(`${this.interactionId}|${label.toLowerCase()}`)); 
                        break;
                }                
            }   

            this.UpdateMessage();
        }          
    };
};

export const ChatMessage = (text) =>
{
    return { type : 4, data: { content: text}};
};

export const CreateMessage = (content) =>
{
    return {type: 4, data: { content : content, components : []}};
};

export const CreateActionRow = () =>
{
    return { type: 1, components : [] };
};

export const CreateButton = (label, id, style, emoji, url, disabled) =>
{
    let button = {
        type : 2,        
        label : label,
        style: style
    };

    if(emoji != null)
    {
        button.emoji = emoji;
    }

    if(url != "")
    {
        button.url = url;
        button.style = 5;
    }
    else
    {
        button.custom_id = id;
    }

    if(disabled)
    {
        button.disabled = true;
    }

    return button;
};

export const CreateSelectionList = (id, options) =>
{
    let selectionList = { type : 3, custom_id: id, options: []};
    options.forEach((o) => {
        selectionList.options.push(CreateOption(o));
    });
    return selectionList;
};

export const CreateOption = (label, value = "", description = "", emoji = null) =>
{
    let option = {
        label : label
    };

    if(value != "")
    {
        option.value = value.toLowerCase();
    }
    else
    {
        option.value = label.toLowerCase();
    }

    if(description != ""){ 
        option.description = description;
    };

    if(emoji != null){
        option.emoji = emoji;
    }

    return option;
};

export const CreateUserSelect = (id) =>
{
    return { type : 5, custom_id: id };
};

export const CreateRoleSelect = (id) =>
{
    return { type : 6, custom_id: id };
};

export const CreateMentionableSelect = (id) =>
{
    return { type : 7, custom_id: id };
};

export const CreateChannelSelect = (id) =>
{
    return { type : 8, custom_id: id };
};

export const GetComponentCount = (actionRow) =>
{
    const componentCount = {
        buttons : 0,
        select : 0,
        others : 0
    };

    actionRow.components.forEach((c) => {
        if(c.type == 2)
        {
            componentCount.buttons++;
        }
        else if(c.type == 3)
        {
            componentCount.select++;
            componentCount.others++;
        }
        else
        {
            componentCount.others++;
        }
    });

    return componentCount;
};

/*
export const Modal = (request, title, id, label, paragraph = false, required = true, value = '', placeholder = '') => {
    const modal = {
        'title': title,
        'custom_id': `${request.body.data.id}|${id.toLowerCase()}`,
        'components': [{
            'type': 1,
            'components': [{
            'type': 4,
            'custom_id': `${request.body.data.id}|${id.toLowerCase()}_${label.toLowerCase()}`,
            'label': label,
            'style': paragraph ? 2 : 1,
            'min_length': 1,
            'max_length': 4000,            
            'required': required
            }]
        }]
    };

    if(value != '')
    {
        modal.components[0].components[0].value = value;
    }

    if(placeholder != '')
    {
        modal.components[0].components[0].placeholder = placeholder;
    }

    return modal;
};*/

export const CommandBuilder = () =>
{
    return {
        command : null,
        commandType : '',

        //A slash command
        CreateChatInputCommand : function(name, description){
            this.command = 
            {
                type: 1,
                name: name.toLowerCase(),
                description: description
            }

            this.commandType = 'chat';
        },
        //UI command click user
        CreateUserCommand : function(name){
            this.command = 
            {
                type: 2,
                name: name
            }

            this.commandType = 'user';
        },
        //UI command click message
        CreateMessageCommand : function(name){
            this.command = 
            {
                type: 3,
                name: name
            }

            this.commandType = 'message';
        },
        CreateChoice : function(name, value)
        {
            return {name: name, value: value};
        },
        AddStringParameter : function(name, description, choices = [], required = true){ this.AddParameter(3, name, description, choices, required) },
        AddIntegerParameter : function(name, description, choices = [], required = true){ this.AddParameter(4, name, description, choices, required) },
        AddBooleanParameter : function(name, description, required = true){ this.AddParameter(5, name, description, [], required) },
        AddUserParameter : function(name, description, required = true){ this.AddParameter(6, name, description, [], required) },
        AddChannelParameter : function(name, description, required = true){ this.AddParameter(7, name, description, [], required) },
        AddRoleParameter : function(name, description, required = true){ this.AddParameter(8, name, description, [], required) },
        AddMentionableParameter : function(name, description, required = true){ this.AddParameter(9, name, description, [], required) },
        AddNumberParameter : function(name, description, choices = [], required = true){ this.AddParameter(10, name, description, choices, required) },
        AddAttachmentParameter : function(name, description, required = true){ this.AddParameter(11, name, description, [], required) },
        AddParameter : function(type, name, description, choices, required)
        {
            if(this.commandType != 'chat')
            {
                console.log('Can only add parameters to command type: chat');
                return;
            }

            //Create the option (parameter)
            let option = {
                type: type,
                name: name.toLowerCase(),
                description: description,
                required: required
            };

            //Add choices if there are any.
            if(choices.length > 0)
            {
                option.choices = choices;
            }

            //Only add them if the command is created.
            if(this.command != null)
            {
                //The options array already exists.
                if('options' in this.command)
                {
                    if(!option.required)
                    {
                        //Add it on the end.
                        this.command.options.push(option);
                    }
                    else
                    {
                        let firstNonRequiredIndex = this.command.options.findIndex((op) => !op.required);
                        if(firstNonRequiredIndex == -1)
                        {
                            //No non-required options, so add it on the end.
                            this.command.options.push(option);
                        }
                        else
                        {
                            //Add it at the end of the required options, before non required ones.
                            this.command.options.splice(firstNonRequiredIndex, 0, option);
                        }
                    }                    
                }
                else
                {
                    this.command.options = [option];
                }
            }
        }
    };
};