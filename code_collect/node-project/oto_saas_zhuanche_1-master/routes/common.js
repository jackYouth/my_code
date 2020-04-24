/**
 * Created by Garry on 2017/6/6.
 */

const express = require('express');
const handlers = require('../handlers');

const router = express.Router();

module.exports = router;

//测试
router.get('/testAPI', (req, res) => {
    res.status(200).json('ok');
});