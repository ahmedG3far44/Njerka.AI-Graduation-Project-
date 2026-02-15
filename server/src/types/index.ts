import {Request} from "express";


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

export interface UserData {
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

export interface UserTrainingData {
    trainDays: number;
    userGoal: "lose" | "gain" | "balance";
    activityLevel: "sedentary" | "lightly" | "moderately" | "very" | "extremely";
}

export interface UserDietData {
    dietGoal: "lose" | "gain" | "balance";
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    meals: {
        type: string;
        calories: number;
        macros: {
            protein: number;
            carbs: number;
            fat: number;
        };
        items: {
            name: string;
            amount: number;
            serving: string;
            calories: number;
            macros: {
                protein: number;
                carbs: number;
                fat: number;
            };
        }[];
    }[];
}

export interface UserTrainingPlan {
    name: string;
    description: string;
    trainDays: number;
    restDays: number;
    programmDays: {
        day: string;
        focus: string;
        exercises: {
            video: string;
            name: string;
            sets: number;
            reps: number;
            rest: number;
        }[];
    }[];
}

