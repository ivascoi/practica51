'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addTable(
            'Tips',
            {
              AuthorId:{
                type: Sequelize.INTEGER
              }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeTable('Tips', 'AuthorId');
    }
};
