import {Router, Response} from "express"
import {AuthRequest} from "../types/index";
import models from "../models/models";


const router = Router();


router.get("/me", async (req : AuthRequest, res : Response) => {
    try {
        const user = req ?. user;
        if (! user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const [userData, profile, dietPlan, trainPlan, familyMembers, subscription, familyMembersDietPlan] = await Promise.all([
            models.User.findById(user._id),
            models.Profile.findOne(
                {user: user._id}
            ),
            models.Diet.findOne(
                {user: user._id}
            ),
            models.TrainPlan.findOne(
                {user: user._id}
            ),
            models.Profile.find(
                {user: user._id, type: "member"}
            ),
            models.Subscription.findOne(
                {user: user._id}
            ),
            models.FamilyDietPlan.findOne(
                {user: user._id}
            )
        ])

        if (!userData) {
            return res.status(404).json({message: "User not found"});
        }

        if (!profile) {
            return res.status(404).json({message: "User profile not found"});
        }

        if (!trainPlan) {
            return res.status(404).json({message: "User training data not found"});
        }

        if (!dietPlan) {
            return res.status(404).json({message: "User diet data not found"});
        }
        if (!familyMembersDietPlan){
            return res.status(404).json({message: "User family diet data not found"});
        }

        return res.status(200).json({
            success: true,
            data: {
                user: userData,
                profile: profile,
                dietPlan: dietPlan,
                trainPlan: trainPlan,
                familyMembers: familyMembers,
                subscription: subscription,
                familyMembersDietPlan: familyMembersDietPlan
            },
            message: "Current user data fetched successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, data: null, message: "Internal server error"});
    }
})


export default router;
