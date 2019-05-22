'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        const { UUID, UUIDV1, STRING, DATE, ENUM } = Sequelize;
        return queryInterface.createTable(
            'users',
            {
                id: { type: UUID, defaultValue: UUIDV1, primaryKey: true, allowNull: false },
                name: { type: STRING(64), allowNull: false },
                password: { type: STRING(256), allowNull: false },
                description: STRING(256),
                salt: STRING(256),
                additionalInfo: STRING,
                // timestamps
                createdAt: DATE,
                updatedAt: DATE,
            },
            { charset: 'UTF8' },
        );
    },

    down: queryInterface => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable('users');
    },
};
