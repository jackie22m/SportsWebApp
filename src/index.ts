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
import {
  getMyGames,
  joinAGame,
  leavePickupGame,
  playersInGame,
  updatePlayerGameStatus,
} from './controllers/gameParticipation.js';
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
  getMe,
  getMyProfile,
  getUser,
  logIn,
  logOut,
  updateUser,
} from './controllers/User.js';

import {
  createPost,
  deleteAPost,
  getAPost,
  getFeed,
  getPostsBySportsTag,
  getPostsByTopic,
  updateAPost,
} from './controllers/post.js';
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
app.get('/api/me', getMe);
app.post('/api/login', logIn);
app.post('/api/signup', createUser); // maybe delete
app.delete('/api/sessions', logOut);

// USER
app.post('/api/users', createUser); // create new account ? maybe need to be removed
app.get('/api/users/me', getMyProfile); // get my profile
app.get('/api/users/:userId', getUser); // view another user
app.patch('/api/users/:userId', updateUser); // update user
app.delete('/api/users/me', deleteMyAccount); // delete my account
app.delete('/api/admin/users/:userId', adminDeleteUser); // admin delete user * delete

app.get('/api/users', getAllUsersController); // for testing DELETE

// ATHLETE PROFILE
app.post('/api/athleteProfiles', createAthleteProfile); // create new account
app.get('/api/athleteProfiles/me', viewMyAthleteProfile); // get my athlete profile
app.get('/api/athleteProfiles/:userId', getAnAthleteProfile); // get another athlete profile
app.get('/api/athleteProfiles', getAthleteProfilesBySport); // get athletes by sport
app.get('/api/athleteProfiles', getAthleteProfilesByLocation); // get athletes by location
app.patch('/api/athleteProfiles/:userId', updateAthleteProfile); // update athlete profile
app.delete('/api/athleteProfiles/:userId', deleteAthleteProfile);
app.get('/api/athleteProfiles', getAllAthleteProfiles);

// PICKUP GAMES
app.post('/api/pickupGames', createPickupGame); // creating a pickup game
//app.get('/pickupGames', getAllPickupGamesController); // get all pickup games
app.get('/api/pickupGames/:gameId', getAPickupGame); // get a pickup game
app.get('/api/pickupGames/upcoming', getUpcomingGames); // get upcoming games
// FILTERS
app.get('/api/pickupGames', getPickGamesBySport); // get pickup games by sport
app.get('/api/pickupGames', getPickupGamesByLocation); // get pickup games by location
app.get('/api/pickupGames', getPickupGamesByDate); // get pickup games by date
app.get('/api/pickupGames', getPickupGamesByTime); // get pickup games by time

app.patch('/api/pickupGames/:gameId', updatePickupGame); // update pickup game
app.delete('/api/pickupGames/:gameId', cancelPickupGame); // cancel pickup game

// Game Participation
app.post('/api/pickupGames/join/:gameId', joinAGame); // join a pickup game
app.delete('/api/pickupGames/leave/:gameId', leavePickupGame); // leave a pickup game
app.get('/api/pickupGames/players/:gameId', playersInGame); // get players in a game
app.get('/api/users/me/games/', getMyGames); // get games a user is in
app.patch('/api/pickUpGames/:gameId/players/:userId', updatePlayerGameStatus);

//Posts
app.post('/api/posts', createPost);
app.get('/api/posts/:postId', getAPost);
app.get('/api/posts', getFeed); // needs to remove user information
app.get('/api/posts', getPostsBySportsTag);
app.get('/api/posts', getPostsByTopic);
app.put('/api/posts/:postId', updateAPost);
app.delete('/api/posts/:postId', deleteAPost);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
