import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from "openai";
dotenv.config();

const PORT = process.env.PORT

const app = express();
app.use(express.json()); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
 
app.options('*', cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/testPlayerAnswer', async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
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
            model: "gpt-3.5-turbo",
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
    const aiPromptList = req.body.aiPrompt
    const firstBeginning = aiPromptList.split(",")[0]
    const secondBeginning = aiPromptList.split(",")[1]
    const thirdBeginning = aiPromptList.split(",")[2]
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "Follow the user's exact orders, step by step."
                },
                { 
                    role: "user", 
                    content: `1. Generate me a 5+ letter word that starts with the letters '${firstBeginning}' in that exact order. Provide a brief definition. 2. Generate me a 5+ letter word that starts with the letters '${secondBeginning}' in that exact order. Provide a brief definition. 3. Generate me a 5+ letter word that starts with the letters '${thirdBeginning}' in that exact order. Provide a brief definition. 4. Assess the 3 words that you have generated. Decide which of these words you are most sure is a legitimate word that is at least 5 letters long and undeniably found in the Oxford English Dictionary. 5. Finish your prompt with your chosen legitimate word surrounded by three asterisks on each side.`
                }
            ],
            temperature: 0.7,
            top_p: 0.5
        });
        console.log(response.choices[0].message.content)
        const aiReply = response.choices[0].message.content.trim().split("***")[1].toLowerCase()
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