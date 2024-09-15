// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getWordOfTheDay, isCharInWord } from "../../word-util/util";

type CharacterInfo = {
    char: string;
    scoring: {
        in_word: boolean;
        correct_idx: boolean;
    };
};

type IncorrectResponse = {
    guess: string;
    was_correct: boolean;
    character_info: CharacterInfo[];
};

export default function handler(req: VercelRequest, res: VercelResponse) {    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(req);
    console.log(res);
    
    if (req.method === "POST") {
        console.log(req.body);
        let { guess }: { guess: string } = req.body; // Get guessed word
        const wotd = getWordOfTheDay(); // Get word of the day :P
        if (wotd === guess) {
            res.status(200).json({ guess: guess, was_correct: true });
            return;
        } else {
            // We only support 5-char words right now.
            // Incorrect guess
            let arr: CharacterInfo[] = [];

            for (let i = 0; i < guess.length; i++) {
                arr.push({
                    char: guess[i],
                    scoring: {
                        in_word: isCharInWord(guess[i], wotd),
                        correct_idx: guess[i] === wotd[i],
                    },
                });
            }
            const resp: IncorrectResponse = {
                guess: guess,
                was_correct: false,
                character_info: arr,
            };
            res.status(200).json(resp);
            return;
        }
    } else {
        res.status(405).json({ error: `${req.method} unsupported.` });
    }
}
