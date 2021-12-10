const User = require('../models/User');
const Deck = require('../models/Deck');
const Joi = require('@hapi/joi');

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
    
    return res.status(200).json({decks: user.decks})
    }

const index = async (req, res, next) => {
    const users = await User.find({})

    return res.status(200).json({users})
}

const newUser = async (req, res, next) => {
    const newUser = new User(req.value.body)

    await newUser.save()

    return res.status(201).json({user: newUser})
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

    res.status(201).json({deck: newDeck})
    }

const replaceUser = async (req, res, next) => {
    //enforce new user to old user
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)
    
    return res.status(200).json({success: true})
}

const updateUser = async (req, res, next) => {
    const { userID } = req.value.params

    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)
    
    return res.status(200).json({success: true})
}

module.exports = {
    getUser,
    getUserDecks,
    index,
    newUser,
    newUserDeck,
    replaceUser,
    updateUser
}