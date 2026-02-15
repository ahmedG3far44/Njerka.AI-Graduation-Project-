import express from 'express';
import models from '../models/models';
import data from '../utils/data.json';


const router = express.Router();

router.post('/seed', async (req , res) => {
    try { // 1. Clear existing data
        await Promise.all([
            models.User.deleteMany({}),
            models.Subscription.deleteMany({}),
            models.Profile.deleteMany({}),
            models.Diet.deleteMany({}),
            models.TrainPlan.deleteMany({}),
            models.FamilyDietPlan.deleteMany({})
        ]);

        // 3. Insert into DB
        await models.User.insertMany(data.users);
        await models.Subscription.insertMany(data.subscriptions);
        await models.Profile.insertMany(data.profiles);
        await models.Diet.insertMany(data.diets);
        await models.TrainPlan.insertMany(data.trainPlans);
        await models.FamilyDietPlan.insertMany(data.familyDietPlans);

        res.status(201).json({message: "Database seeded successfully!"});
    } catch (error) {
        res.status(500).json({
            name: (error as Error).name,
            error: (error as Error).message,
            stack: (error as Error).stack
        });
    }
});

export default router;
