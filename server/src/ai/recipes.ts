import ai from "../config/ai";
import {IMeal} from "../types/index";
import {FunctionCallingConfigMode, Type} from "@google/genai";


const generateRecipeFunction = {
    name: "generate_recipe",
    description: "Generate a complete, cookable recipe using ONLY the provided meal items. Quantities must be scaled based on the number of servings.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "Human-readable recipe name"
            },

            servings: {
                type: Type.NUMBER,
                description: "Number of servings this recipe makes"
            },

            ingredients: {
                type: Type.ARRAY,
                description: "List of ingredients with scaled quantities",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "Ingredient name (must come from meal items)"
                        },
                        quantity: {
                            type: Type.NUMBER,
                            description: "Scaled quantity based on servings"
                        },
                        unit: {
                            type: Type.STRING,
                            description: "Measurement unit (g, tbsp, etc.)"
                        }
                    },
                    required: ["name", "quantity", "unit"]
                }
            },

            steps: {
                type: Type.ARRAY,
                description: "Step-by-step cooking instructions",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        step: {
                            type: Type.NUMBER,
                            description: "Step order number"
                        },
                        instruction: {
                            type: Type.STRING,
                            description: "Clear cooking instruction"
                        }
                    },
                    required: ["step", "instruction"]
                }
            },

            nutritionSummary: {
                type: Type.OBJECT,
                description: "Aggregated nutrition for all servings",
                properties: {
                    totalCalories: {
                        type: Type.NUMBER
                    },
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
                required: ["totalCalories", "protein", "carbs", "fat"]
            }
        },

        required: [
            "name",
            "servings",
            "ingredients",
            "steps",
            "nutritionSummary"
        ]
    }
};


async function generateRecipe(meal : IMeal) {
    const prompt = `Generate a recipe for a ${
        meal.type
    } meal with ${
        meal.calories
    } calories and ${
        meal.macros.protein
    }g protein, ${
        meal.macros.carbs
    }g carbs, ${
        meal.macros.fat
    }g fat.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [
                    {
                        functionDeclarations: [generateRecipeFunction]
                    }
                ],
                toolConfig: {
                    functionCallingConfig: {
                        mode: FunctionCallingConfigMode.ANY,
                        allowedFunctionNames: ['generate_recipe']
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



// {
//     "name": "High-Protein Garlic Chicken & Broccoli Bowl",
//     "ingredients": [
//         {
//             "unit": "g",
//             "name": "Chicken Breast (raw)",
//             "quantity": 340
//         },
//         {
//             "quantity": 250,
//             "name": "Cooked Brown Rice",
//             "unit": "g"
//         },
//         {
//             "unit": "g",
//             "name": "Olive Oil",
//             "quantity": 20
//         },
//         {
//             "quantity": 150,
//             "name": "Broccoli Florets",
//             "unit": "g"
//         },
//         {
//             "name": "Low-Sodium Soy Sauce",
//             "unit": "tbsp",
//             "quantity": 1
//         },
//         {
//             "quantity": 2,
//             "unit": "cloves",
//             "name": "Minced Garlic"
//         }
//     ],
//     "steps": [
//         {
//             "instruction": "Cut the chicken breast into bite-sized cubes and season lightly with salt and pepper.",
//             "step": 1
//         },
//         {
//             "instruction": "Heat the olive oil in a large skillet or wok over medium-high heat.",
//             "step": 2
//         },
//         {
//             "instruction": "Add the chicken cubes to the skillet and cook for 5-6 minutes until browned and cooked through.",
//             "step": 3
//         },
//         {
//             "instruction": "Add the minced garlic and broccoli florets to the skillet. Stir-fry for another 3-4 minutes until the broccoli is tender-脆 (tender-crisp).",
//             "step": 4
//         },
//         {
//             "instruction": "Stir in the low-sodium soy sauce and toss everything to coat evenly. Remove from heat.",
//             "step": 5
//         },
//         {
//             "instruction": "Place the warm cooked brown rice in a large bowl and top with the garlic chicken and broccoli mixture.",
//             "step": 6
//         }
//     ],
//     "nutritionSummary": {
//         "fat": 25,
//         "totalCalories": 850,
//         "protein": 86,
//         "carbs": 66
//     },
//     "servings": 1
// }

export default generateRecipe;