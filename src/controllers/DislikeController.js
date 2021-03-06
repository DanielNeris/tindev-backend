const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        try {
            const { user } = req.headers;
            const { devId } = req.params;

            const loggedDev = await Dev.findById(user);
            const targetDev = await Dev.findById(devId);

            if(!targetDev)
                throw res.status(400).json({ message: 'Dev not exists' });

            loggedDev.dislikes.push(targetDev._id);

            await loggedDev.save();

            return res.json(loggedDev);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
};