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
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { 
                    role: "system", 
                    content: "The user will give you a word. If it is definitely a legitimate word from the Oxford English Dictionary, reply with 'yes', otherwise reply with 'no'." 
                },
                { 
                    role: "user", 
                    content: req.body.confirmedPlayerAnswer
                }
            ],
            temperature: 0,
        });
        const isWordValid = response.choices[0].message.content.trim().toLowerCase()
        res.json({isWordValid: isWordValid})
        console.log("validation complete")
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
    }
})

app.post('/api/generateAIReply', async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { 
                    role: "system", 
                    content: "The user will give you a list of potential word beginnings. For every word beginning, generate a word that is at least 5 letters long, that starts with the exact word beginning. Validate the existence of each generated word by providing a brief definition. If you are certain that you have generated a valid word from the Oxford English Dictionary that begins with any of the 3 word-starters, end your prompt with the word you are most sure is a valid word, surrounded in asterisks. ----- For example, if the user were to send you 'mash, ash, sh'. A perfect reply would be: 'mashed: crushed into a soft, smooth consistency, often used for food like potatoes. ashamed: feeling guilt or embarrassment over one's actions or failures. showreel: a video compilation showcasing a person's work, used as a portfolio in creative industries.*ashamed*"
                },
                { 
                    role: "user", 
                    content: req.body.aiPromptList
                }
            ],
            temperature: 0.7,
            top_p: 0.5
        });
        const aiReply = response.choices[0].message.content.trim().split("*")[1].toLowerCase()
        res.json({aiReply: aiReply})
        } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
     }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app