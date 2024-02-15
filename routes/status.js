var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');
var db = require('../models')
var StatusService = require("../services/statusService");
var statusService = new StatusService(db);

router.use(jsend.middleware);


router.get('/',isAuth, async (req, res, next) => {
     // #swagger.tags = ['Status']
      // #swagger.description = "Gets the ist of all statuses."
      // #swagger.produces = ['application/json']
    try {
        const status = await statusService.getAll();
        if ( status.length === 0) {
            return res.status(404).jsend.fail({message: "No status found."});
        }
        res.jsend.success(status);
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal Server Error' });
    }
});

router.get('/:id',isAuth, async (req, res) => {
     // #swagger.tags = ['Status']
      // #swagger.description = "Gets a status by Id"
      // #swagger.produces = ['application/json']
    try {
        const status = await statusService.getOne(req.params.id);
        if (!status) {
            return res.status(404).jsend.error({ message: "Status not found" });
        }
        res.jsend.success(status);
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal Server Error' });
    }
});



module.exports = router;