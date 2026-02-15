import ai from "../config/ai";

import {Type, FunctionCallingConfigMode} from '@google/genai';


interface UserData {
    age: number;
    gender: "male" | "female";
    weight: number;
    tall: number;
    goal: "lose" | "gain" | "balance";
    goalWeight: number;
    activityLevel: "sedentary" | "lightly" | "moderately" | "very" | "extremely";
    allergies?: string[];
    foodPreferences?: string[];
    restrictions?: string[];
}

const generateDietPlanFunction = {
    name: 'generate_diet_plan',
    description: 'Generates a structured diet plan with calories, macros, and specific meal items based on user health data.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            type: {
                type: Type.STRING,
                description: 'e.g., ketogenic, Paleo, Mediterranean, low-carb, high-protein, balanced etc.'
            },
            dietGoal: {
                type: Type.STRING,
                description: 'e.g., lose, gain, balance'
            },
            calories: {
                type: Type.NUMBER
            },
            macros: {
                type: Type.OBJECT,
                properties: {
                    protein: {
                        type: Type.NUMBER
                    },
                    carbs: {
                        type: Type.NUMBER
                    },
                    fat: {
                        type: Type.NUMBER
                    }
                },
                required: ['protein', 'carbs', 'fat']
            },
            meals: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: {
                            type: Type.STRING,
                            description: 'breakfast, lunch, or dinner'
                        },
                        calories: {
                            type: Type.NUMBER
                        },
                        macros: {
                            type: Type.OBJECT,
                            properties: {
                                protein: {
                                    type: Type.NUMBER
                                },
                                carbs: {
                                    type: Type.NUMBER
                                },
                                fat: {
                                    type: Type.NUMBER
                                }
                            }
                        },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: {
                                        type: Type.STRING
                                    },
                                    amount: {
                                        type: Type.NUMBER
                                    },
                                    serving: {
                                        type: Type.STRING
                                    },
                                    calories: {
                                        type: Type.NUMBER
                                    },
                                    macros: {
                                        type: Type.OBJECT,
                                        properties: {
                                            protein: {
                                                type: Type.NUMBER
                                            },
                                            carbs: {
                                                type: Type.NUMBER
                                            },
                                            fat: {
                                                type: Type.NUMBER
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        required: ['type', 'dietGoal', 'calories', 'macros', 'meals']
    }
};


async function generateDietPlan(userData : UserData) {
    const prompt = `Generate a diet plan for a ${userData.age} year old ${userData.gender}, weight ${userData.weight}kg, height ${userData.tall}cm. 
    Goal: ${userData.goal} to ${userData.goalWeight}kg. 
    Activity: ${userData.activityLevel}. 
    Allergies: ${userData.allergies.join(', ')}.
    Preferences: ${userData.foodPreferences.join(', ')}.
    Restrictions: ${userData.restrictions.join(', ')}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: {
                tools: [
                    {
                        functionDeclarations: [generateDietPlanFunction]
                    }
                ],
                toolConfig: {
                    functionCallingConfig: {
                        mode: FunctionCallingConfigMode.ANY,
                        allowedFunctionNames: ['generate_diet_plan']
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
        console.error("API Error:", error);
    }
}


// const user = {
// age: 25,
// goal: 'loss',
// weight: 90,
// gender: 'male',
// tall: 185,
// allergies: ['nuts'],
// foodPreferences: ['high protein'],
// activityLevel: 'active',
// goalWeight: 80,
// restrictions: ['no dairy']
// };


export default generateDietPlan;
