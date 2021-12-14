const User = require('../models/User');
const Deck = require('../models/Deck');
const Joi = require('@hapi/joi');
const { JWT_SECRET } = require('../configs')

const JWT = require('jsonwebtoken');

const encodedToken = (userID) => {
  return JWT.sign({
    iss: 'Loc Nguyen',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)

  }, 'NodejsApiAuthentication')
}


const idSchema = Joi.object().keys({
  userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

async function getUser(req, res, next) {
  const validatorResult = idSchema.validate(req.params);
  // console.log('validator result ', validatorResult);

  const { userID } = req.value.params;

  const user = await User.findById(userID);

  return res.status(200).json({ user });
}
const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params

  //Get user
  const user = await User.findById(userID).populate('decks')

  return res.status(200).json({ decks: user.decks })
}

const index = async (req, res, next) => {
  const users = await User.find({})

  return res.status(200).json({ users })
}

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body)

  await newUser.save()

  return res.status(201).json({ user: newUser })
}

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params

  //Create a new deck
  const newDeck = new Deck(req.value.body)

  //Get user
  const user = await User.findById(userID)

  //Assign user as a deck's owner
  newDeck.owner = user

  //Save the Deck
  await newDeck.save()

  //Add deck to user's decks array 'decks'
  user.decks.push(newDeck._id)

  //Save the user
  await user.save()

  res.status(201).json({ deck: newDeck })
}

const replaceUser = async (req, res, next) => {
  //enforce new user to old user
  const { userID } = req.value.params

  const newUser = req.value.body

  const result = await User.findByIdAndUpdate(userID, newUser)

  return res.status(200).json({ success: true })
}

const secret = async (req, res, next) => {
  console.log('Called to secret function. ')
}

const signIn = async (req, res, next) => {
  console.log('Called to signIn function. ')

}

const signUp = async (req, res, next) => {
  console.log('Called to signup function. ')
  const { firstName, lastName, email, password } = req.value.body

  //Check if there is a user withe the some user
  const foundUser = await User.findOne({ email })
  console.log('found user', foundUser)
  if (foundUser) return res.status(403).json({ error: { message: 'email is already in use' } })

  //Create a new user
  const newUser = new User({ firstName, lastName, email, password })

  newUser.save()

  //Encode a token
  const token = encodedToken(newUser._id)
  res.setHeader('Authorization', token)

  return res.status(201).json({ success: true })

}


const updateUser = async (req, res, next) => {
  const { userID } = req.value.params

  const newUser = req.value.body

  const result = await User.findByIdAndUpdate(userID, newUser)

  return res.status(200).json({ success: true })
}

module.exports = {
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDeck,
  replaceUser,
  secret,
  signIn,
  signUp,
  updateUser
}