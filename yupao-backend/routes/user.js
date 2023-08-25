const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.post('/user/register', User.register)
router.post('/user/login', User.login)
router.post('/user/logout', User.logout)
router.get('/user/current', User.current)
router.get('/user/search/tags', User.searchUsersByTags)
router.post('/user/update', User.updateUser)
router.get('/user/recommend', User.userRecommend)


module.exports = router