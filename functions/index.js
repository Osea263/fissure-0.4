const functions = require("firebase-functions");

// Get the secret key we set in the previous step
const API_KEY = functions.config().gemini.key;

// This is the Gemini API URL. Note the "?key=" at the end.
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

// This is our new, secure function
exports.getTriviaQuestions = functions.https.onCall(async (data, context) => {

  // --- Security Check ---
  // This ensures only authenticated users (even anonymous ones) can call this.
  // It's a great first line of defense against abuse.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be signed in to call this function."
    );
  }

  // 'data' is the 'config' object (difficulty, numQuestions) sent from our React app.
  const { config } = data;

  // --- Build the Prompt (Same logic as before) ---
  let topics;
  let difficultyDescription;

  if (config.difficulty === 'Easy') {
      topics = 'What is MegaEth, Which Solutions does MEgaEth provides, How is MegaEth different form other layer 2 blcochain, Blockchain Fundamentals, what is a wallet, what is Ethereum, what is a dApp, and what is a Layer 2 (L2).';
      difficultyDescription = 'Easy. The questions must be suitable for a beginner who has just entered the Web3 space. Avoid deep technical jargon.';
  } else if (config.difficulty === 'Medium') {
      topics = 'Layer 2 Rollups (General), ZK vs. Optimistic Rollups, and MegaETH Architecture (basic concepts).';
      difficultyDescription = 'Medium. The user understands basic blockchain concepts but wants to learn about L2s and MegaETH specifically.';
  } else { // 'Hard'
      topics = 'MegaETH Architecture (advanced concepts), sequencer design, rollup internals, and ZK proofs in practice.';
      difficultyDescription = 'Hard. The user is an advanced Web3 user or developer. The questions should be highly specific and technical.';
  }

  const systemPrompt = `You are a professional trivia question generator specializing in Web3. You must generate exactly ${config.numQuestions} trivia questions on the following topics: ${topics}.

  The difficulty level must be: ${difficultyDescription}.

  Each question must have exactly four plausible, distinct options, one of which is the correct answer. The entire output (questions, options, and correct answers) **must be written entirely in ${config.targetLanguage}.** The output must strictly follow the provided JSON schema.`;

  const userQuery = `Generate ${config.numQuestions} questions now.`;

  // --- Build the Payload ---
  // This is the same schema you had in your original file.
  const TRIVIA_SCHEMA = {
      type: "ARRAY",
      items: {
          type: "OBJECT",
          properties: {
              question: { "type": "STRING" },
              options: { "type": "ARRAY", "items": { "type": "STRING" } },
              correctAnswer: { "type": "STRING" }
          },
          required: ["question", "options", "correctAnswer"],
      }
  };

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: TRIVIA_SCHEMA,
    },
  };

  // --- Call the API ---
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new functions.https.HttpsError(
        "internal",
        `API response error: ${response.status}`
      );
    }

    // Send the raw JSON result back to the React app
    return await response.json();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to fetch questions from the Gemini API."
    );
  }
});