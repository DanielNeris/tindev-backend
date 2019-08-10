const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        try {
            const { username } = req.body;

            const userExists = await Dev.findOne({ user: username });

            if(userExists)
                throw res.json({message: 'user already exist', userExists});

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
            return res.json(error);
        }
    }
};