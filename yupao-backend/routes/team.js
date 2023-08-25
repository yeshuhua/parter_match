const express = require('express')
const router = express.Router()
const Team = require('../controllers/team')

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.post('/team/add', Team.teamAdd)
router.post('/team/quit', Team.teamQuit)
router.post('/team/delete', Team.teamDelete)
router.post('/team/update', Team.teamUpdate)
router.get('/team/my/create', Team.teamSearchByUserId)
router.get('/team/my/join', Team.teamHasJoin)
router.get('/team/list', Team.teamList)
router.get('/team/list/page', Team.teamListPagination)
router.post('/team/join', Team.teamJoin)

module.exports = router