// 1. Firebase Configuration (REMOVED)

// 2. Google Gemini API Key (Loaded from .env.local)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
export const IS_API_KEY_MISSING = !GEMINI_API_KEY || GEMINI_API_KEY === "[YOUR_GEMINI_API_KEY]";

// 3. Application ID for Firestore Path (REMOVED)

// --- Global Constants and Configuration ---
export const VIEWS = {
    CONFIG: 'config',
    LOADING: 'loading',
    GAME: 'game',
    SCORE: 'score'
};

export const POINTS_MAP = {
    'Easy': 5,
    'Medium': 10,
    'Hard': 20,
};

export const SUPPORTED_LANGUAGES = [
    { code: 'English', name: 'English' },
    { code: 'Spanish', name: 'Español' },
    { code: 'French', name: 'Français' },
    { code: 'German', name: 'Deutsch' },
    { code: 'Japanese', name: '日本語' },
    { code: 'Korean', name: '한국어' },
    { code: 'Portuguese', name: 'Português' },
    { code: 'Chinese (Simplified)', name: '简体中文' },
    { code: 'Vietnamese', name: 'Tiếng Việt' },
];

export const CATEGORIES = [
    'Blockchain Basics',
    'Ethereum',
    'Layer 1 Concepts',
    'Layer 2 Rollups',
    'MegaETH Architecture'
];

export const FIXED_CATEGORY = 'MegaETH Architecture';
export const REWARD_THRESHOLD = 100;
export const CORRECT_PASSWORD = 'B4201C3F91A2';

export const TRIVIA_SCHEMA = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            question: { "type": "STRING", description: "The trivia question text." },
            options: {
                "type": "ARRAY",
                "items": { "type": "STRING" },
                description: "An array of exactly four plausible answer choices."
            },
            correctAnswer: { "type": "STRING", description: "The correct answer, which must be identical to one of the options." }
        },
        required: ["question", "options", "correctAnswer"],
        propertyOrdering: ["question", "options", "correctAnswer"]
    }
};