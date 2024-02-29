import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from "openai";
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT

const app = express();
app.use(express.json()); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
 
app.options('*', cors());

app.post('/api/testPlayerAnswer', async (req, res) => {
    console.log(req.body.possibleWords)
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { 
                    role: "system", 
                    content: "The user will give you a list of potential words, separated by commas. Your task is to identify the word that you are 100% sure is correctly spelled and definitely in the Oxford English dictionary and surround it in '*'s. Provide a brief definition or a sentence using the word to demonstrate that it is a legitimate word from the Oxford English Dictionary." 
                },
                { 
                    role: "user", 
                    content: req.body.possibleWords
                }
            ],
            temperature: 0,
        });
        const confirmedWord = response.choices[0].message.content.split("*")[1]?.toLowerCase()
        res.json({confirmedWord: confirmedWord});
        console.log("test complete");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
    }
});


app.post('/api/validatePlayerAnswer', async (req, res) => {
    const confirmedPlayerAnswer = req.body.confirmedPlayerAnswer
    const APIBody = {
        model: "gpt-3.5-turbo-instruct",
        prompt: `If '${confirmedPlayerAnswer}' is a word spelled correctly and definitely in the Oxford English dictionary, reply with 'yes', if '${confirmedPlayerAnswer}' is not a word in the Oxford English dictionary, or has been spelled incorrectly, reply with 'no'.`,
        temperature: 0,
        max_tokens: 500,
        top_p: 0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    };

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify(APIBody)
        });
        const data = await response.json();
        const isWordValid = data.choices[0].text.trim().toLowerCase()
        res.json({isWordValid: isWordValid})
        console.log("validation complete")
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
    }
})

app.post('/api/generateAIReply', async (req, res) => {
    const aiPromptList = req.body.aiPromptList
    console.log(aiPromptList[0], aiPromptList[1])
    const APIBody = {
        model: "gpt-3.5-turbo-instruct",
        prompt: `Your task is to generate a word that is at least 5 letters long, that begins with '${aiPromptList[1]}' and validate its existence by providing a brief definition. Then,generate a word that begins with '${aiPromptList[0]}', that is at least 5 letters long, and provide a brief definition. If you are certain that you have generated a valid word from the Oxford English Dictionary that begins with either of the 2 word-starters, end your prompt with your best word surrounded in asterisks.
        ---
        A perfect reply structure for you to adhere to would be:
        aluminium - a light metal used to make cans. calcium - a mineral used to strengthen bones.
        *aluminium*
        `,
        temperature: 0.2,
        max_tokens: 500,
        top_p: 0.5,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      };
      try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify(APIBody)
        });
        const data = await response.json();
        const aiReply = data.choices[0].text.trim().split("*")[1]
        res.json({aiReply: aiReply})
        console.log("ai reply complete")
        } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
     }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app