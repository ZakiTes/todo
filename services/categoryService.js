class CategoryService{
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async create({name, UserId}) {
        return this.Category.create({
            name: name,
            UserId: UserId
        });
    }

    async getOne(id, userId) {
        return this.Category.findOne({
            where: {Id: id, UserId: userId}
        })
    }


    async getAllByUserId({userId}) {
        return this.Category.findAll({ 
            where: {UserId: userId}
         });
    }

    async updateCategory({ categoryId, userId, name }) {
        const category = await this.getOne(categoryId, userId);
        if (!category) {
            throw new Error("Category not found or does not belong to the user.");
        }
    
        category.name = name;
        await category.save();
        return category;
    }

    async deleteCategory({ categoryId, userId }) {
        const category = await this.getOne(categoryId, userId);
        if (!category) {
            throw new Error("Category not found or does not belong to the user.");
        }
    
        // Check if the category is assigned to any todos
        const todosCount = await category.countTodos();
        if (todosCount > 0) {
            throw new Error("Cannot delete category as it is assigned to one or more todos.");
        }
    
        // If the category is not assigned to any todos, delete it
        await category.destroy();
    }
    
}

module.exports = CategoryService;