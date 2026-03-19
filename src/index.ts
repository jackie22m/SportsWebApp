import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { createUser } from './controllers/User.js';
import { CreateAthleteProfile } from './controllers/athleteProfile.js';
import { CreatePickupGame, joinPickupGame } from './controllers/pickupGame.js';
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line
app.post('/users', createUser);
app.post('/athleteProfiles', CreateAthleteProfile);

app.post('/pickupGames', CreatePickupGame);
app.post('/pickupGames/:pickupGameId/:userId', joinPickupGame);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
