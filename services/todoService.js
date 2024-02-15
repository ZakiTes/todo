const StatusService = require('./statusService');
const CategoryService = require('./categoryService');


class TodoService{
    constructor(db) {
        this.client = db.sequelize;
        this.Todo = db.Todo;
        this.statusService = new StatusService(db);
        this.categoryService = new CategoryService(db);
    }

    async getOne(id) {
        return this.Todo.findOne({ where: {Id: id} });
    }

    async getAll() {
        const todos = await this.Todo.findAll();

        const todoNames = await Promise.all(todos.map(async (todo) => {
           const category = await todo.getCategory();
           const status = await todo.getStatus();

           return {
            id: todo.id,
            name: todo.name,
            description: todo.description,
            CategoryName: category.name,
            StatusName: status.name,
            UserId: todo.UserId
           };
        }));
        return todoNames
    }

    async getAllD(userId) {
        const todos = await this.Todo.findAll({
            where: {
                UserId: userId,
                StatusId: {
                    [this.client.Sequelize.Op.ne]: 4 
                }
            }
        });
        if (!todos || todos.length === 0) {
            throw new Error('No todos found for the specified user');
        }
    
        const todoDetails = await Promise.all(todos.map(async (todo) => {
            const category = await todo.getCategory();
            const status = await todo.getStatus();
    
            return {
                id: todo.id,
                name: todo.name,
                description: todo.description,
                CategoryName: category ? category.name : null,
                StatusName: status ? status.name : null,
                UserId: todo.UserId
            };
        }));
    
        return todoDetails;
    }

    async create(name, description, categoryId, statusId, userId) {
        const category = await this.categoryService.getOne(categoryId, userId);
        const status = await this.statusService.getOne(statusId);

        if (!category) {
            throw new Error('Category not found or does not belong to the user.');
        }
        if (!status) {
            throw new Error('Status not found.');
        }
    
        const todo = await this.Todo.create({
            name,
            description,
            CategoryId: categoryId,
            StatusId: statusId,
            UserId: userId
        });

        const categoryName = category.name;
        const statusName = status.name;
    
        return {
            id: todo.id,
            name: todo.name,
            description: todo.description,
            CategoryName: categoryName,
            StatusName: statusName,
            UserId: todo.UserId
        };
    }

    
        async getDeletedTodos(userId) {
            const deletedStatus = await this.statusService.getDeletedStatus();

            if (!deletedStatus) {
                return [];
            }
            const deletedTodos = await this.Todo.findAll({
                where: {
                    UserId: userId,
                    StatusId: deletedStatus.id
                }
                
            });
            const todoDetails = await Promise.all(deletedTodos.map(async (todo) => {
                const category = await todo.getCategory();
                const status = await todo.getStatus();
        
                return {
                    id: todo.id,
                    name: todo.name,
                    description: todo.description,
                    CategoryName: category ? category.name : null,
                    StatusName: status ? status.name : null,
                    UserId: todo.UserId
                };
            }));
        
            return todoDetails;
        }

    async update(id, name, description, categoryId, statusId, userId) {
        const todo = await this.Todo.findByPk(id);
        if (!todo) {
            throw new Error('Todo not found');
        }
        const category = await this.categoryService.getOne(categoryId, userId);
        const status = await this.statusService.getOne(statusId);

        if (!category) {
            throw new Error('Category not found');
        }
        if (!status) {
            throw new Error('Status not found');
        }
        if (todo.UserId !== userId) {
            throw new Error('Unauthorized: Todo does not belong to the user');
        }

        todo.name = name;
        todo.description = description;
        todo.CategoryId = categoryId;
        todo.StatusId = statusId;
        todo.UserId = userId;

        await todo.save();

        return todo;
    }

    async delete(id, userId) {
        const todo = await this.Todo.findByPk(id);
        if (!todo) {
            throw new Error('Todo not found');
        }
        if (todo.UserId !== userId) {
            throw new Error('Unauthorized: Todo does not belong to the user');
        }
        todo.StatusId = 4; 
        await todo.save();
        return todo;
    }  

}

module.exports = TodoService;