import {Router} from "express";

import generateDietPlan from "../ai/dietPlan";
import getTrainingPlan from "../ai/trainingPlan";


const router = Router();


router.post('/diet', async(req, res) => {
    try {
        const payload = req.body;

        // const {age, goal, weight, gender, tall, allergies, foodPreferences, activityLevel, goalWeight, restrictions} = payload;

        const userData = {
            ...payload
        };

        const dietPlan = await generateDietPlan(userData);

        res.status(200).json(dietPlan);
    } catch (error) {
     console.log(error);
     res.status(500).json({error: 'Failed to generate diet plan'});
        
    }
})
router.post('/training', async(req, res) => {
    try {
        const payload = req.body;

        // const {userGoal, trainDays, restDays, activityLevel} = payload;

        const userData = {
            ...payload
        };

        const dietPlan = await getTrainingPlan(userData);

        res.status(200).json(dietPlan);
    } catch (error) {
     console.log(error);
     res.status(500).json({error: 'Failed to generate diet plan'});
        
    }
})



export default router;