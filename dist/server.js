"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// requiring libraries
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGO_URI } = process.env;
// Setting up modules and dependencies
const app = (0, express_1.default)();
// we need to make ${MONGO_DB} change when running tests
console.log(MONGO_URI);
const mongoUri = MONGO_URI;
const seeds_1 = require("./utils/seeds");
// Import other routes for entities
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
// Cors
app.use((0, cors_1.default)());
app.use(express_1.default.json()); //Used to parse JSON bodies
// Function to connect to the database
const conn = () => {
    mongoose_1.default.connect(mongoUri);
};
// Call it to connect
conn();
// Handle the database connection and retry as needed
const db = mongoose_1.default.connection;
db.on("error", (err) => {
    console.log("There was a problem connecting to mongo: ", err);
    console.log("Trying again");
    setTimeout(() => conn(), 5000);
});
db.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'development') {
        yield (0, seeds_1.initializeDb)();
    }
    console.log("Successfully connected to mongo");
}));
// Passport middleware
app.use(passport_1.default.initialize());
// Routes
// app.get("/", express.static("public"));
app.get("/", (req, res) => {
    res.send({ msg: 'Welcome hello' });
});
app.use('/users', userRoutes_1.default);
app.use('/roles', roleRoutes_1.default);
app.use('/events', eventRoutes_1.default);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server up and running on port ${port} in env ${process.env.NODE_ENV} !`));
module.exports = app; // For testing
