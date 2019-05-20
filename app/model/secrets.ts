export default app => {
    const { Sequelize, model } = app;
    const { STRING, DATE, } = Sequelize;

    const projects = model.define('secrets', {
        user: { type: STRING(64), primaryKey: true, allowNull: false },
        secret: { type: STRING(256), allowNull: false },
        description: { type: STRING(256) },
        createdAt: DATE,
        updatedAt: DATE,
    });

    return projects;
};
