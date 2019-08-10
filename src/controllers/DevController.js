const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index (req, res) {
        try {
            const { user } = req.headers;

            const loggedDev = await Dev.findById(user);

            if(!loggedDev)
                throw res.status(400).json({message: 'user not exists'});
            
            const users = await Dev.find({
                $and: [
                    { _id: { $ne: user } },
                    { _id: { $nin: loggedDev.likes } },
                    { _id: { $nin: loggedDev.dislikes } },
                ],
            });

            return res.json(users)
            
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    async store(req, res) {
        try {
            const { username } = req.body;

            const userExists = await Dev.findOne({ user: username });

            if(userExists)
                throw res.json({message: 'user already exists', userExists});

            const response = await axios.get(`https://api.github.com/users/${username}`)

            const { name, bio, avatar_url: avatar } = response.data;

            const dev = await Dev.create({
                name,
                user: username,
                bio,
                avatar
            });

            return res.json(dev);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
};