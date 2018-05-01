'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let accounts = queryInterface.createTable('accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        return Promise.all([accounts]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('accounts');
    }
};