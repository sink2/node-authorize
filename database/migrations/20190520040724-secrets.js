'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        const { STRING, DATE } = Sequelize;
        return queryInterface.createTable(
            'secrets',
            {
                user: { type: STRING(64), primaryKey: true, allowNull: false },
                secret: { type: STRING(256), allowNull: false },
                description: { type: STRING(256) },
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
        return queryInterface.dropTable('secrets');
    },
};
