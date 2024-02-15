class StatusService{
    constructor(db) {
        this.client = db.sequelize;
        this.Status = db.Status;
    }

    async getOne(id) {
        return this.Status.findOne({
            where: {Id: id}
        })
    }

    async getAll() {
        return this.Status.findAll();
    }

    async getDeletedStatus() {
        const deletedStatus = await this.Status.findOne({
            where: { name: 'Deleted' }
        });

        return deletedStatus;
    }

}

module.exports = StatusService;