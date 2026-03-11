const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* /user/test */
// router.get('/test', (req, res) => {
//   res.send('user Test route')
// }
// )

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async (req, res) => {

        const errors = validationResult(req);

        // if errors comes
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            });

        }

        // if error doesn't comes extract email, username and password from req.body;
        const { email, username, password } = req.body;
        // Uses bcrypt to hash password 10 times
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            email: email,
            username: username,
            password: hashPassword
        })

        // res.json(newUser);
        res.redirect('/user/login')
    })

// router for login
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        // Check for error during login
        const errors = validationResult(req);

        // if error comes then send 400 status
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errror: errors.array(),
                message: 'Invalid data'
            })
        }

        // else login the user
        const { username, password } = req.body;

        const user = await userModel.findOne({
            username: username
        })

        // if username not found send message
        if (!user) {
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }
        // Does user.password and the entered password matched
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        // if password matches generate jsonwebtoken
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
            process.env.JWT_SECRET,
        )
        res.cookie('token', token)

        // res.send('Loggen in');
        res.redirect('/home')
    }
)
module.exports = router;