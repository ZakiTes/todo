var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');
var db = require('../models')
var CategoryService = require("../services/categoryService");
var categoryService = new CategoryService(db);


router.use(jsend.middleware);


router.get('/', isAuth, async (req, res, next) => {
     // #swagger.tags = ['Category']
      // #swagger.description = "Gets the list of all category for the logged in user"
      // #swagger.produces = ['application/json']
    try {
        const categories = await categoryService.getAllByUserId({ userId: req.userId });
        res.jsend.success(categories);
    } catch (error) {
        console.error(error);
        res.jsend.error({ message: "Internal server error" });
    }
});

router.get('/:Id', isAuth, async (req, res, next) => {
     // #swagger.tags = ['Category']
      // #swagger.description = "Gets a category by Id for the logged in user"
      // #swagger.produces = ['application/json']
    try {
        const category = await categoryService.getOne(req.params.Id, req.userId);
        res.jsend.success(category);
    } catch (error) {
        console.error(error);
        res.jsend.error({message: "Internal server error" });
    }
});


router.post('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Category']
      // #swagger.description = "Creates a category for the logged in User"
      // #swagger.produces = ['application/json']
    try {
        const { name } = req.body;
        const userId = req.userId;

        if (!name) {
            return res.jsend.fail({
                message: "Name is required in the request body",
            });
        }

        const category = await categoryService.create({ name, UserId: userId });
        res.jsend.success(category);
    } catch (error) {
        res.jsend.error({ message: "Internal server error" });
    }
});


router.put('/:Id', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Category']
      // #swagger.description = "Updates a Category for the logged in user"
      // #swagger.produces = ['application/json']
    try {
        const categoryId = req.params.Id;
        const { name } = req.body;
        const userId = req.userId;

        if (!name) {
            return res.jsend.fail({
                message: "Name is required in the request body",
            });
        }

        const updatedCategory = await categoryService.updateCategory({ categoryId, userId, name });
        res.jsend.success(updatedCategory);
    } catch (error) {
        console.error(error);
        res.jsend.error({ message: "Internal server error" });
    }
});


router.delete('/:Id', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Category']
      // #swagger.description = "Deletes a category for the logged in user"
      // #swagger.produces = ['application/json']
    try {
        const categoryId = req.params.Id;
        const userId = req.userId;

        await categoryService.deleteCategory({ categoryId, userId });
        res.jsend.success(null, { message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error.message.includes("Cannot delete category as it is assigned to one or more todos")) {
            res.jsend.fail({ message: error.message });
        } else {
            res.jsend.error({ message: "Internal server error" });
        }
    }
});



module.exports = router;