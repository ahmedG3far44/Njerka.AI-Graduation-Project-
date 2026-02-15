import mongoose, { Schema } from "mongoose";


enum SubscriptionPlan {
  free = 'free',
  basic = 'basic',
  premium = 'premium'
}

enum SubscriptionStatus {
  active = 'active',
  expired = 'expired',
  canceled = 'canceled'
}

enum SubscriptionDuration {
  monthly = 'monthly',
  yearly = 'yearly'
}

enum Gender {
  male = 'male',
  female = 'female'
}

enum ProfileGoal {
  lose = 'lose',
  gain = 'gain',
  maintain = 'maintain'
}

enum ProfileType {
  member = 'member',
  owner = 'owner'
}

enum MealType {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  snack = 'snack'
}

enum Serving {
  piece = 'piece',
  grams = 'grams',
  ml = 'ml'
}

const MacroSchema = new Schema({
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 }
}, { _id: false });

// --- MealItem Model ---
const MealItemSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  amount: Number,
  serving: { type: String, enum: Serving },
  calories: Number,
  macros: MacroSchema
}, { _id: false });

// --- Meal Model ---
const MealSchema = new Schema({
  type: { type: String, enum: MealType },
  calories: Number,
  macros: MacroSchema,
  items: [MealItemSchema]
}, { _id: false });


// --- User Model ---
const User = mongoose.model('User', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true }));

// --- Subscription Model ---
const Subscription = mongoose.model('Subscription', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: SubscriptionPlan },
  price:{type: Number, default: 0.0},
  status: { type: String, enum: SubscriptionStatus },
  duration: { type: String, enum: SubscriptionDuration },
  expiredAt: Date
}, { timestamps: true }));

// --- Profile Model ---
const Profile = mongoose.model('Profile', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  type: { type: String, enum: ProfileType },
  age: Number,
  weight: Number,
  height: Number,
  gender: { type: String, enum: Gender },
  goal: { type: String, enum: ProfileGoal },
  weightGoal: Number,
  religion: String,
  activityLevel: Number,
  allergies: [String],
  healthConditions: [String],
  foodPreferences: [String],
  dietaryRestrictions: [String]
}, { timestamps: true }));

// --- Diet Model ---
const Diet = mongoose.model('Diet', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  dietType: String,
  calories: Number,
  macros: MacroSchema,
  meals: [MealSchema]
}, { timestamps: true }));

// --- TrainPlan Model ---
const TrainPlan = mongoose.model('TrainPlan', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  trainDays: Number,
  restDays: Number,
  name: String,
  description: String,
  programmDays: [{
    day: String,
    focus: String,
    exercises: [{
        video: String,
        name: String,
        sets: Number,
        reps: Number,
        rest: Number,
        weight: Number
    }]
  }]
}, { timestamps: true }));

// --- FamilyDietPlan Model ---
const FamilyDietPlan = mongoose.model('FamilyDietPlan', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  name: String,
  plan: {
    calories: Number,
    macros: MacroSchema,
    meals: [MealSchema]
  }
}, { timestamps: true }));

const models = { User, Subscription, Profile, Diet, TrainPlan, FamilyDietPlan };


export default models;