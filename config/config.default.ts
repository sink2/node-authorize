import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1558144212894_5308';

    // add your egg config in here
    config.middleware = ['authorize'];

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    };

    config.sequelize = {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        database: 'authorize',
        username: 'root',
        password: 'root',
        define: {
            underscored: false,
        },
    };

    // Custom error handler.
    config.onerror = {
        all(err, ctx: Context) {
            const { code = '' } = err;
            const { service } = ctx;
            let statusCode: StatueCode = 500;
            if (code === 'invalid_param') {
                statusCode = 400;
            }
            ctx.response.set({ 'content-type': 'application/json;charset=utf-8' });
            ctx.status = statusCode;
            ctx.body = JSON.stringify(service.responseHelper.getResponseByStatusCode(statusCode));
        },
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
