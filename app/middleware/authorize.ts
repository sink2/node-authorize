
import { Context } from 'egg';
import { isBlank } from 'rc-js-utils';

const authRule = {
    user: { type: 'string', max: 64 },
    secret: { type: 'string', max: 256 },
};

export default () => async function authorize(ctx: Context, next) {
    const { service, model } = ctx;
    const { header } = ctx;
    const secret = header['x-authorize'];
    const user = header['x-user'];
    // params validate
    ctx.validate(authRule, { user, secret });
    const result = await model.Secrets.findOne({ where: { user, secret } });
    if (isBlank(result)) {
        ctx.status = 401;
        ctx.body = service.responseHelper.getResponseByStatusCode(401);
    } else {
        await next();
    }
};
