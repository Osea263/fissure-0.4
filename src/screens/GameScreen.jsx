import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { POINTS_MAP } from '../lib/constants'; // Import constants

// --- 1. SET THE TIMER DURATION ---
const TIMER_SECONDS = 20;

export const GameScreen = ({ questions, currentQIndex, handleAnswer, config, score }) => {
    const questionData = questions[currentQIndex];
    
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    // --- 2. ADD STATE FOR THE TIMER ---
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    
    // We use a ref to hold the interval ID
    const timerRef = useRef(null);

    // --- 3. ADD THE TIMER LOGIC ---
    useEffect(() => {
        // Reset the timer when the question changes
        setTimeLeft(TIMER_SECONDS);
        setIsAnswered(false);
        setSelectedOption(null);

        // Clear any old timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Start the new timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    // TIME'S UP!
                    clearInterval(timerRef.current); // Stop the timer
                    handleAnswer(false); // Mark as incorrect
                    return 0;
                }
                // Tick down
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup: Clear the interval when the component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [currentQIndex, handleAnswer]); // This hook re-runs on every new question

    
    // --- 4. UPDATE 'submitAnswer' TO STOP THE TIMER ---
    const submitAnswer = (option) => {
        if (isAnswered) return;

        // --- STOP THE TIMER ---
        // The user answered, so clear the interval.
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        // --- END STOP ---

        setSelectedOption(option);
        setIsAnswered(true);
        const isCorrect = option === correctAnswer;
        
        setTimeout(() => {
            handleAnswer(isCorrect);
        }, 1500); 
    };

    // (The old useEffect that just reset state is no longer needed,
    // its logic is now in the main timer useEffect)

    const getOptionClass = (option) => {
        // ... (This function remains exactly the same)
        if (!isAnswered) {
            return 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-emerald-500';
        }
        // Handle "time's up" state
        if (timeLeft === 0 && !selectedOption) {
            if (option === correctAnswer) {
                return 'bg-emerald-900 text-emerald-300 border-emerald-600'; // Show correct
            }
            return 'bg-gray-800 text-gray-500 border-gray-700'; // Fade others
        }
        // (Rest of the function is the same)
        if (option === correctAnswer) {
            return 'bg-emerald-900 text-emerald-300 border-emerald-600'; // Correct answer
        }
        if (option === selectedOption && option !== correctAnswer) {
            return 'bg-red-900 text-red-300 border-red-700'; // User chose wrong answer
        }
        return 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed';
    };
    
    const pointsValue = POINTS_MAP[config.difficulty] || 0;
    
    if (!questionData) return null; // Safety check
    const { question, options, correctAnswer } = questionData;

    return (
        <div className="space-y-8 p-6 bg-gray-900 rounded-sm shadow-lg border border-gray-700 text-white"> 
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-emerald-400">
                    QUESTION {currentQIndex + 1} / {questions.length}
                </h3>
                <p className="text-lg font-medium text-gray-400">
                    Difficulty: {config.difficulty} ({pointsValue} points) | Total Score: {score}
                </p>

                {/* --- 5. ADD THE TIMER VISUALS --- */}
                <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                            style={{ 
                                // Calculate percentage
                                width: `${(timeLeft / TIMER_SECONDS) * 100}%`,
                                // Change color when time is low
                                backgroundColor: timeLeft <= 5 ? '#f43f5e' : '#10b981' 
                            }}
                        ></div>
                    </div>
                    <p className="text-lg font-bold text-emerald-400 mt-2"
                       style={{ color: timeLeft <= 5 ? '#f43f5e' : '#10b981' }}
                    >
                        Time Left: {timeLeft}s
                    </p>
                </div>
                {/* --- END VISUALS --- */}
            </div>

            <div className="bg-gray-800 p-6 rounded-sm border border-gray-700">
                <p className="text-center md:text-2xl text-white leading-normal">{question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => submitAnswer(option)}
                        // Disable buttons when time is up
                        disabled={isAnswered || timeLeft === 0}
                        className={`py-3 px-4 text-left text-base md:text-lg font-medium rounded-sm border-2 transition duration-300 break-words
                            ${(isAnswered || timeLeft === 0) ? '' : 'hover:scale-[1.01] active:scale-100'}
                            ${getOptionClass(option)}`}
                    >
                        {String.fromCharCode(65 + index)}. {option}
                    </button>
                ))}
            </div>
            
            {/* Update the feedback text for when time runs out */}
            {(isAnswered || timeLeft === 0) && (
                <div className="text-center pt-4">
                    <p className={`text-2xl font-bold ${
                        timeLeft === 0 ? 'text-red-500' :
                        selectedOption === correctAnswer ? 'text-emerald-400' : 'text-red-500'
                    }`}>
                        {timeLeft === 0 ? `TIME'S UP! The correct answer was: ${correctAnswer}` :
                         selectedOption === correctAnswer ? `CORRECT! +${pointsValue} POINTS` :
                         `WRONG! The correct answer was: ${correctAnswer}`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};