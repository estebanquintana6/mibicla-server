// requiring libraries
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config()

const { MONGO_URI } = process.env;
console.log(MONGO_URI);

// Setting up modules and dependencies
const app = express();
// we need to make ${MONGO_DB} change when running tests
const mongoUri = MONGO_URI;
import { initializeDb } from "./utils/seeds";
// Import other routes for entities
import users from './routes/userRoutes';
import roles from './routes/roleRoutes';
import events from './routes/eventRoutes';
import categories from './routes/categoryRoutes';
import auth from './routes/authRoutes';

// Cors
app.use(cors());

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// Function to connect to the database
const conn = () => {
    mongoose.connect(mongoUri);
};
// Call it to connect
conn();

// Handle the database connection and retry as needed
const db = mongoose.connection;
db.on("error", (err: Error) => {
    console.log("There was a problem connecting to mongo: ", err);
    console.log("Trying again");
    setTimeout(() => conn(), 5000);
});
db.once("open", async () => {
    if (process.env.NODE_ENV === 'development') {
        await initializeDb();
    }
    console.log("Successfully connected to mongo");
});

// Passport middleware
app.use(passport.initialize());

// Routes

// app.get("/", express.static("public"));
app.get("/", (req: Request, res: Response) => {
    res.send({ msg: 'Welcome hello' })
});
app.use('/users', users);
app.use('/roles', roles);
app.use('/events', events);
app.use('/category', categories);
app.use('/auth', auth);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server up and running on port ${port} in env ${process.env.NODE_ENV} !`));

module.exports = app; // For testing