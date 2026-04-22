import express, { Express } from 'express';
import './config.js'; // do not remove this line
import {
  createAthleteProfile,
  deleteAthleteProfile,
  getAllAthleteProfiles,
  getAnAthleteProfile,
  getAthleteProfilesByLocation,
  getAthleteProfilesBySport,
  updateAthleteProfile,
  viewMyAthleteProfile,
} from './controllers/athleteProfile.js';
import { joinAGame } from './controllers/gameParticipation.js';
import {
  cancelPickupGame,
  createPickupGame,
  getAPickupGame,
  getPickGamesBySport,
  getPickupGamesByDate,
  getPickupGamesByLocation,
  getPickupGamesByTime,
  getUpcomingGames,
  updatePickupGame,
} from './controllers/pickupGame.js';
import {
  adminDeleteUser,
  createUser,
  deleteMyAccount,
  getAllUsersController,
  getMyProfile,
  getUser,
  logIn,
  logOut,
  updateUser,
} from './controllers/User.js';
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

// AUTHORIZATION
app.post('/login', logIn);
app.post('/signup', createUser); // maybe delete
app.delete('/sessions', logOut);

// USER
app.post('/users', createUser); // create new account ? maybe need to be removed
app.get('/users/me', getMyProfile); // get my profile
app.get('/users/:userId', getUser); // view another user
app.patch('/users/:userId', updateUser); // update user
app.delete('/users/me', deleteMyAccount); // delete my account
app.delete('/admin/users/:userId', adminDeleteUser); // admin delete user * delete

app.get('/users', getAllUsersController); // for testing DELETE

// ATHLETE PROFILE
app.post('/athleteProfiles', createAthleteProfile); // create new account
app.get('/athleteProfiles/me', viewMyAthleteProfile); // get my athlete profile
app.get('/athleteProfiles/:userId', getAnAthleteProfile); // get another athlete profile
app.get('/athleteProfiles', getAthleteProfilesBySport); // get athletes by sport
app.get('/athleteProfiles', getAthleteProfilesByLocation); // get athletes by location
app.patch('/athleteProfiles/:userId', updateAthleteProfile); // update athlete profile
app.delete('/athleteProfiles/:userId', deleteAthleteProfile);
app.get('/athleteProfiles', getAllAthleteProfiles);

// PICKUP GAMES
app.post('/pickupGames', createPickupGame); // creating a pickup game
//app.get('/pickupGames', getAllPickupGamesController); // get all pickup games
app.get('/pickupGames/:gameId', getAPickupGame); // get a pickup game
app.get('/pickupGames/upcoming', getUpcomingGames); // get upcoming games
// FILTERS
app.get('/pickupGames', getPickGamesBySport); // get pickup games by sport
app.get('/pickupGames', getPickupGamesByLocation); // get pickup games by location
app.get('/pickupGames', getPickupGamesByDate); // get pickup games by date
app.get('/pickupGames', getPickupGamesByTime); // get pickup games by time

app.patch('/pickupGames/:gameId', updatePickupGame); // update pickup game
app.delete('/pickupGames/:gameId', cancelPickupGame); // cancel pickup game

// Game Participation
app.post('/pickupGames/join/:gameId', joinAGame); // join a pickup game

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
