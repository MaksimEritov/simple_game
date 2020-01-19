
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');

//POST / route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user } } = req;


    if(!user.username) {
        return res.status(422).json({
        errors: {
            username: 'is required',
        },
        });
    }

    if(!user.password) {
        return res.status(422).json({
        errors: {
            password: 'is required',
        },
        });
    }

    const finalUser = new User(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => {
            const user = finalUser;
            user.token = finalUser.generateJWT();

            res.cookie('token', user.token)
            res.cookie('username', user.username)

            res.json({ user: finalUser.toAuthJSON() })
        })
        .catch((e) => {
            console.log(e)
            return res.sendStatus(406)
        })
});
  
//POST signin route (optional, everyone has access)
router.post('/signin', auth.optional, (req, res, next) => {

const user = req.body.data ? JSON.parse(req.body.data) : req.body.user;

if(!user.username) {
    return res.status(422).json({
    errors: {
        username: 'is required',
    },
    });
}

if(!user.password) {
    return res.status(422).json({
    errors: {
        password: 'is required',
    },
    });
}

return passport.authenticate(
        'local', 
        { session: false }, 
        (err, passportUser, info) => {
            if (err) next(err);
            if (passportUser) {
                
                const user = passportUser;
                user.token = passportUser.generateJWT();

                res.cookie('token', user.token)
                res.cookie('username', user.username)

                return res.json({ user: user.toAuthJSON() });
            }

            return res.sendStatus(401);
        })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/try', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    return User.findById(id)
        .then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;
