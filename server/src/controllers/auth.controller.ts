import {Request, Response} from 'express';

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import models from '../models/models';

import {signRefreshToken, signToken, verifyToken} from "../utils/jwt";



dotenv.config();

const NODE_ENV = process.env.NODE_ENV as string || "development";
const JWT_SECRET = process.env.JWT_SECRET as string;

// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;


export interface TokenPayload {
    id: string;
    name: string;
    email: string;
    role: string | "user" | "admin";
    avatar: string;
}

export async function register(req : Request, res : Response) {
    try {
        const {email, password} = req.body;


        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await models.User.findOne({email});

        if (user) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // name, email, passowrd, role = "user"
        const newUser = await models.User.create({email, passwordHash: hashedPassword, role: "user"});


        // age, gender, avatar, allergies, height, weight, goal, activityLevel, goalWeight, foodPreferences, prefered_meals_number
        const newUserProfile = await models.Profile.create({userId: newUser._id});

        const tokenPayload = {
            email: newUser.email,
            id: newUser._id,
            role: newUser.role,
            name: newUser.name,
            avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }


        const token = signToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to register user", error});
    }
}


export async function login(req : Request, res : Response) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await models.User.findOne({email});

        if (! user) {
            return res.status(400).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

        if (! isPasswordValid) {
            return res.status(400).json({message: "Wrong email or password"});
        }


        const tokenPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }

        const token = signToken(tokenPayload);

        const refreshToken = signRefreshToken(tokenPayload);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({message: "User logged in successfully", token, refreshToken});
    } catch (error) {
        res.status(500).json({message: "Failed to login user", error});
    }
}


export async function logout(req : Request, res : Response) {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to logout user", error});
    }
}

export async function refresh(req : Request, res : Response) {
    try {
        const refresh_token = req.cookies.refresh_token as string;

        if (! refresh_token) {
            return res.status(401).json({message: "No refresh token found"});
        }
        const decoded = verifyToken(refresh_token)as TokenPayload;
        const tokenPayload = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar
        }
        const token = signToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({message: "User logged in successfully", token, refreshToken});
    } catch (error) {
        res.status(500).json({message: "Failed to refresh token", error});
    }
}
