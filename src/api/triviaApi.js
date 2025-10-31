import { API_URL, TRIVIA_SCHEMA } from '../lib/constants';

export const fetchQuestions = async (config) => {
    const targetLanguage = config.targetLanguage;

    // --- NEW LOGIC ---
    // We now define topics and difficulty descriptions based on the config.
    let topics;
    let difficultyDescription;

    if (config.difficulty === 'Easy') {
        topics = 'What is MegaEth, Blockchain Fundamentals, what is a wallet, what is Ethereum, what is a dApp, and what is a Layer 2 (L2).';
        difficultyDescription = 'Easy. The questions must be suitable for a beginner who has just entered the Web3 space, focusing on the basics of MegaEth, How megaEth Works, the Solutions MEgaEth provides, How is MegaEth different form other layer 2 blcochain. Avoid deep technical jargon.';
    } else if (config.difficulty === 'Medium') {
        topics = 'Layer 2 Rollups (General), ZK vs. Optimistic Rollups, and MegaETH Architecture (basic concepts).';
        difficultyDescription = 'Medium. The user understands basic blockchain concepts but wants to learn about L2s and MegaETH specifically.';
    } else { // 'Hard'
        topics = 'MegaETH Architecture (advanced concepts), sequencer design, rollup internals, and ZK proofs in practice.';
        difficultyDescription = 'Hard. The user is an advanced Web3 user or developer. The questions should be highly specific and technical.';
    }
    // --- END NEW LOGIC ---

    // The System Prompt is updated to use our new variables.
    const systemPrompt = `You are a professional trivia question generator specializing in Web3. You must generate exactly ${config.numQuestions} trivia questions on the following topics: ${topics}.
    
The difficulty level must be: ${difficultyDescription}.

Each question must have exactly four plausible, distinct options, one of which is the correct answer. The entire output (questions, options, and correct answers) **must be written entirely in ${targetLanguage}.** The output must strictly follow the provided JSON schema.`;

    const userQuery = `Generate ${config.numQuestions} questions now.`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: TRIVIA_SCHEMA
        }
    };

    // Retry logic (no changes here)
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                 throw new Error(`API response error: ${response.status}`);
            }
            
            const result = await response.json();
            const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!jsonText) throw new Error("API returned no valid JSON content.");

            const parsedQuestions = JSON.parse(jsonText);
            
            if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
                throw new Error("API generated an empty or invalid question array.");
            }

            return parsedQuestions; // Success!

        } catch (e) {
            if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            } else {
                // If all retries fail, throw the last error
                throw e; 
            }
        }
    }
    throw new Error("Failed to fetch questions after 3 attempts.");
};