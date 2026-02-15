import {Router} from 'express';

import { register, login, logout, refresh } from '../controllers/auth.controller';
import ai from '../config/ai';

const router = Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

router.post('/ai', async(req, res) => {
    try{
        const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents:"can you tell what is the modern skills should I learn as Frontend Developer in 2026? ",
    });

    console.log(response.text + " \n ");

    const functionCall = response.functionCalls?.[0];

    if (functionCall) {
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
    }

    
    res.status(200).json({data: response.text});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

export default router;
