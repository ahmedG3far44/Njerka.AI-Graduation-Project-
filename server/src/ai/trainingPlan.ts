import ai from '../config/ai';
import {FunctionCallingConfigMode, Type} from '@google/genai';


interface TrainingData {
    trainDays: number;
    userGoal: "lose" | "gain" | "balance";
    activityLevel: "sedentary" | "lightly" | "moderately" | "very" | "extremely";
}

const generateTrainingPlanDeclaration = {
    name: 'generate_training_plan',
    description: 'Generates a detailed training program with progressive overload principles.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the split (e.g., Push Pull Legs, Upper/Lower, Full Body, Arnold Split, Exterior Posterior)'
            },
            description: {
                type: Type.STRING
            },
            trainDays: {
                type: Type.NUMBER
            },
            restDays: {
                type: Type.NUMBER
            },
            programmDays: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: {
                            type: Type.STRING
                        },
                        focus: {
                            type: Type.STRING
                        },
                        exercises: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    video: {
                                        type: Type.STRING,
                                        description: 'gif link that relate to the exercise'
                                    },
                                    name: {
                                        type: Type.STRING
                                    },
                                    sets: {
                                        type: Type.NUMBER
                                    },
                                    reps: {
                                        type: Type.NUMBER
                                    },
                                    rest: {
                                        type: Type.NUMBER,
                                        description: 'Rest time in seconds'
                                    },
                                    weight: {
                                        type: Type.NUMBER,
                                        description: 'Weight to lift in kg'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        required: [
            'name',
            'description',
            'trainDays',
            'restDays',
            'programmDays'
        ]
    }
};

async function getTrainingPlan(userData : TrainingData) {
    const prompt = `Create a ${
        userData.trainDays
    }-day training plan focused on ${
        userData.userGoal
    }. 
    Ensure the plan incorporates progressive overload (increasing intensity/volume). 
    Activity level: ${
        userData.activityLevel
    }. 
    Use the provided function to structure the output.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [
                    {
                        functionDeclarations: [generateTrainingPlanDeclaration]
                    }
                ],
                toolConfig: {
                    functionCallingConfig: {
                        mode: FunctionCallingConfigMode.ANY,
                        allowedFunctionNames: ['generate_training_plan']
                    }

                }
            }
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            return response.functionCalls[0].args;
        } else {
            throw new Error("Model did not return a function call.");
        }
    } catch (error) {
        console.error("Error generating training plan:", error);
    }
}


export default getTrainingPlan;


// const userTraining = {
//     userGoal: "lose",
//     trainDays: 7,
//     activityLevel: "moderately"
// }
