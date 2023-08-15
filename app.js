import 'dotenv/config';
import express from 'express';
import * as manager from './bot/metalted.botmanager.js';
import { DiscordRequest, VerifyDiscordRequest } from './bot/utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

//Incoming messages on /interactions
app.post('/interactions', async function (req, res) 
{
  const result = manager.HandleInteraction(req);  
  return res.send(result);
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});