import { Application } from '../metalted.application.js';
import * as builder from '../metalted.builder.js';

export const Hangman = (request, userInteractionSystem) =>
{
  const application = Application(request, userInteractionSystem);
  application.ALL_CHARACTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  application.currentWord = '';
  application.guessedCharacters = [];
  application.CreateTurn = function(request)
  {
      const turn = builder.MessageBuilder(request, application.applicationId);
      const maskedWord = CreateMaskedWord(application.currentWord, application.guessedCharacters);
      const remainingCharacters = application.ALL_CHARACTERS.filter(char => !application.guessedCharacters.includes(char));
    
      turn.SetContent(maskedWord);
      turn.AddSelectionList(0, 'selection', remainingCharacters);
      return turn.message;
  }
  application.parse = function(request, isComponent)
  {
      if(!isComponent)
      {
            const msg = builder.MessageBuilder(request, application.applicationId);
            msg.SetContent("Are you ready to play Hangman?");
            msg.AddPrimaryButton(0, "Play");
            msg.AddSecondaryButton(0, "Cancel");
            return msg.message;
      }
      else
      {
          const customIdData = request.body.data.custom_id.split("|");
          const applicationId = customIdData[0];
          const component = customIdData[1];
        
          switch(component)
          {
              case "play":
                  application.currentWord = GetRandomWord();
                  application.guessedCharacters = [];
                  return application.CreateTurn();                  
              case 'selection':
                  const selectedCharacter = request.body.data.values[0].toUpperCase();
                  application.guessedCharacters.push(selectedCharacter);
              
                  if(CheckWin(application.currentWord, application.guessedCharacters))
                  {
                      this.exit();
                      return builder.ChatMessage(`You won! The word was: ${application.currentWord}`);                      
                  }
                  else
                  {
                      return application.CreateTurn();
                  }
                  break;              
              case "cancel":
                  return builder.ChatMessage(`Cancelled hangman.`);
                  this.exit();
                  break;
          }
      }
  }
  
  return application;
};

function GetRandomWord() 
{
    const wordArray = ["VEHICLE", "ZEEPKIST", "TOWER", "SONIC"];
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    return wordArray[randomIndex];
}

function CreateMaskedWord(word, guessedLetters)
{
  let result = "";
  
  word.split('').forEach((character) =>
  {  
      if(!guessedLetters.includes(character))
      {
        result += '$ ';
      }
      else
      {
        result += character + ' ';
      }
  });
  
  return result;
}

function CheckWin(word, guessedCharacters)
{  
    let result = word.split('').filter(char => !guessedCharacters.includes(char));
    return result.length == 0;
}