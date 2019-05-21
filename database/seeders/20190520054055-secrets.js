'use strict';

module.exports = {
    up: queryInterface => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.bulkInsert('People', [{
                name: 'John Doe',
                isBetaMember: false
            }], {});
        */
        return queryInterface.bulkInsert('secrets', [
            {
                user: 'admin',
                secret: '3a5450f526e0427db41eac4cde6c3a0949441e45',
                description: 'System preset',
            },
        ]);
    },

    down: queryInterface => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete('secrets', null, {});
    },
};
