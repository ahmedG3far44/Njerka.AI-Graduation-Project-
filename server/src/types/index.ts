import {Request} from "express";

export interface IMealType {
    type: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface IGender {
    gender: "male" | "female";
}

export interface IServing {
    unit: string | "piece" | "grams" | "ml";
}

export interface IDietGoal {
    goal: "lose" | "gain" | "balance";
}

export interface IActivityLevel {
    activityLevel: "sedentary" | "lightly" | "moderately" | "very" | "extremely";
}


export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    avatar_url?: string;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export interface IProfileType{
    age: number;
    gender: IGender;
    weight: number;
    tall: number;
    goal: IDietGoal;
    goalWeight: number;
    activityLevel: IActivityLevel;
    allergies?: string[];
    foodPreferences?: string[];
    restrictions?: string[];
}

// Diet Plan Types:

export interface IDietPlan {
    dietGoal: IDietGoal;
    calories: number;
    macros: IMealMacros;
    meals: {
        type: IMealType;
        calories: number;
        macros: IMealMacros;
        items: IMealItem[];
    }[]
}

// Training Plan Types:
export interface IGenerateTrainingData {
    trainDays: number;
    userGoal: IDietGoal;
    activityLevel: IActivityLevel;
}
export interface IExercise {
    video: string;
    name: string;
    sets: number;
    reps: number;
    rest: number;
    weight: number;
}
export interface ITrainingPlan {
    name: string;
    description: string;
    trainDays: number;
    restDays: number;
    programmDays: {
        day: string;
        focus: string;
        exercises: IExercise[];
    }[];
}






// Meal Types:
export interface IMealMacros {
    protein: number;
    carbs: number;
    fat: number;
}
export interface IMealItem {
    name: string;
    quantity: number;
    unit: IServing;
    calories: number;
    macros: IMealMacros;
}
export interface IMeal {
    type: string;
    calories: number;
    macros: IMealMacros;
    items: IMealItem[];
}