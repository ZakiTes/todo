module.exports = (sequelize, Sequelize) => {
	const Status = sequelize.define(
		'Status',
		{
			name: {
				type: Sequelize.DataTypes.STRING,

				allowNull: false,
			},
		},
		{
			timestamps: false,
			tableName: 'status',
		}
	);

	Status.associate = function (models) {
		Status.hasMany(models.Todo, { foreignKey: { allowNull: false } });
	};

	return Status;
};

