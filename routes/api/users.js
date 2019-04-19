// @login & register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const passport =require('passport')

const keys = require('../../config/keys')
const User = require('../../models/User')

// $route POST api/users/register
// @desc  返回请求的json数据
// @access public
router.post('/register', (req, res) => {
    // 查询数据库中是否存在邮箱
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.json({
                status: '1',
                msg: "此邮箱已存在"
            })
        } else {
            const avatar = gravatar.url('req.body.email', {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                identity: req.body.identity
            })
            // 密码加盐
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if (err) {
                        throw err
                    }
                    newUser.password = hash
                    // 储存用户
                    newUser.save().then((user) => {
                        res.json({
                            user
                        })
                    }).catch((err1) => {
                        throw err1
                    })

                });
            });
        }
    })
})

// $route POST api/users/login
// @desc  token jwt passport
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // 查询数据库
    User.findOne({email}).then(user => {
        if (!user) {
            return res.json({
                msg: "此用户不存在"
            })
        } else {
            // 密码比较
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const rule = {
                        id: user.id,
                        name: user.name,
                        identity: user.identity
                    }
                    jwt.sign(rule, keys.secretOrKeys, {
                        expiresIn: 3600 
                    }, (err, token) => {
                        if (err) {
                            throw err
                        }
                        res.json({
                            "msg": "success",
                            token: "Bearer " + token
                        })
                    })
                } else {
                    return res.json({
                        "msg": "密码不正确"
                    })
                }
            })
        }
    })
})

// $route POST api/users/current
// @desc  token jwt passport
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

module.exports = router