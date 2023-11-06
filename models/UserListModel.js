const {
    DataTypes
} = require('sequelize');
const Sequelize = require("sequelize");

module.exports = sequelize => {
    const attributes = {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: true,
            comment: null,
            field: "id"
        },
        work_area_t: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "work_area_t"
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "name"
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "password"
        },
        active: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: 1,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "active"
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "created_at"
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal('NULL'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "updated_at"
        },
    };
    const options = {
        tableName: "user_list",
        comment: "",
        indexes: [],
        createdAt: false,
        updatedAt: false
    };
    return sequelize.define("UserListModel", attributes, options);
};
