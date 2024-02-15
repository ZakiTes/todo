var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');
var db = require('../models')
var TodoService = require("../services/todoService");
var todoService = new TodoService(db);


router.use(jsend.middleware);


/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Gets the list of all todos with the status not deleted."
  // #swagger.produces = ['application/json']
	try {
        const userId = req.userId;
        const todos = await todoService.getAllD(userId);
        res.status(200).jsend.success({ todos });
    } catch (error) {
    res.status(500).jsend.error({ message: 'Internal server error'})
}
});

// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async (req, res) => {
      // #swagger.tags = ['Todos']
      // #swagger.description = "Gets the list of all todos."
      // #swagger.produces = ['application/json']
	try {
		const todo = await todoService.getAll();
		res.status(200).jsend.success(todo);
	} catch (error) {
		res.status(500).jsend.error({ message: 'Internal server error' });
	}
});

// Return all the todos with the deleted status
router.get('/deleted', isAuth, async  (req, res) => {
      // #swagger.tags = ['Todos']
      // #swagger.description = "Gets the list of all todos with the status deleted."
      // #swagger.produces = ['application/json']
	try {
		const userId = req.userId;
		const deletedTodos = await todoService.getDeletedTodos(userId);
		res.status(200).jsend.success(deletedTodos);
	} catch(error) {
		res.status(500).jsend.error({ message: "Internal server error" });
	}
});

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res, next) => {
      // #swagger.tags = ['Todos']
      // #swagger.description = "Creats a todo for logged in user."
      // #swagger.produces = ['application/json']
    try {
        const { name, description, categoryId, statusId } = req.body;
        const userId = req.userId;

        const todo = await todoService.create(name, description, categoryId, statusId, userId);
        res.status(200).jsend.success(todo);
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal Server Error' });
    }
});


// Return all the statuses from the database
router.get('/status', isAuth, async (req, res) => {
      // #swagger.tags = ['Todos']
      // #swagger.description = "Gets the list of all status."
      // #swagger.produces = ['application/json']
	try {
        const status = await todoService.statusService.getAll();
        if ( status.length === 0) {
            return res.status(404).jsend.fail({message: "No status found."});
        }
        res.status(200).jsend.success(status);
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal Server Error' });
    }
});

// Change/update a specific todo for logged in user
router.put('/:id', isAuth, async (req, res) => {
      // #swagger.tags = ['Todos']
      // #swagger.description = "Updates a todo for a logged in user."
      // #swagger.produces = ['application/json']
	try {
        const todoId = req.params.id;
        const { name, description, categoryId, statusId } = req.body;
		const userId = req.userId;

        const updatedTodo = await todoService.update(todoId, name, description, categoryId, statusId, userId);
        res.status(200).jsend.success(updatedTodo);
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal server error' });
    }
});

// Delete a specific todo if for the logged in user
router.delete('/:id', isAuth, async (req, res) => {
         // #swagger.tags = ['Todos']
         // #swagger.description = "Deletes a todo for logged in user."
         // #swagger.produces = ['application/json']
	try {
        const todoId = req.params.id;
        const userId = req.userId;

        await todoService.delete(todoId, userId);
        
        res.status(200).jsend.success({ message: 'Todo updated to "deleted" status' });
    } catch (error) {
        res.status(500).jsend.error({ message: 'Internal server error' });
    }
});

module.exports = router;

