// @login & register
const express = require('express')
const router = express.Router()
const passport =require('passport')

const keys = require('../../config/keys')
const Profile = require('../../models/Profile')

// $route GET api/profiles/test
// @desc  返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'profile works'
  })
})

// $route POST api/profiles/add
// @desc  增加profile数据
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profilesFileds = {}

  if (req.body.type) {
    profilesFileds.type = req.body.type
  }
  if (req.body.describe) {
    profilesFileds.describe = req.body.describe
  }
  if (req.body.income) {
    profilesFileds.income = req.body.income
  }
  if (req.body.type) {
    profilesFileds.expend = req.body.expend
  }
  if (req.body.type) {
    profilesFileds.cash = req.body.cash
  }
  if (req.body.type) {
    profilesFileds.remark = req.body.remark
  }

  new Profile(profilesFileds).save().then((profile) => {
    res.json(profile)
  })
})

// $route GET api/profiles/
// @desc  获取所有数据
// @access private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().then(profile => {
    if (!profile) {
      res.status(404).json({
        msg: "无数据"
      })
    }
    return res.json(profile)
  }).catch(err => {
    throw err
  })
})

// $route GET api/profiles/:id
// @desc  获取单条数据
// @access private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne(req.body.id).then(profile => {
    if (!profile) {
      res.status(404).json({
        msg: "无数据"
      })
    }
    return res.json(profile)
  }).catch(err => {
    throw err
  })
})

// $route POST api/profiles/edit
// @desc  编辑profile数据
// @access private
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profilesFileds = {}

  if (req.body.type) {
    profilesFileds.type = req.body.type
  }
  if (req.body.describe) {
    profilesFileds.describe = req.body.describe
  }
  if (req.body.income) {
    profilesFileds.income = req.body.income
  }
  if (req.body.type) {
    profilesFileds.expend = req.body.expend
  }
  if (req.body.type) {
    profilesFileds.cash = req.body.cash
  }
  if (req.body.type) {
    profilesFileds.remark = req.body.remark
  }

  Profile.findOneAndUpdate(
      {_id: req.params.id},
      {$set: profilesFileds},
      {new: true}
    ).then((profile) => {
    if (profile) {
      res.json(profile)
    }
  }).catch(err => {
    throw err
  })
})

// $route POST api/profiles/delete/:id
// @desc  删除profile数据
// @access private
router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndDelete({
    _id: req.params.id
  }).then(profile => {
    profile.save().then(profile => {
      res.json(profile)
    })
  }).catch(err => {
    throw err
  })
})

module.exports = router