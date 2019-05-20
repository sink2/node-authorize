export default app => {
    const { Sequelize, model } = app;
    const { STRING, DATE, UUID, UUIDV1 } = Sequelize;

    const users = model.define('users', {
        id: { type: UUID, defaultValue: UUIDV1, primaryKey: true, allowNull: false },
        name: { type: STRING(64), allowNull: false },
        password: { type: STRING(256), allowNull: false },
        description: STRING(256),
        salt: STRING(256),
        // timestamps
        createdAt: DATE,
        updatedAt: DATE,
    });

    return users;
};
