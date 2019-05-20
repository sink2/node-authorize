import { Controller } from 'egg';
import * as crypto from 'crypto';
import { pick } from 'lodash';

const createRule = {
    name: { type: 'string', max: 64 },
    password: { type: 'string', max: 256 },
    description: { type: 'string', max: 256, required: false },
};

const encryptPassword = (password: string, salt: string = crypto.randomBytes(32).toString()) => {
    const md5 = crypto.createHash('md5');
    const sha1 = crypto.createHash('sha1');
    const saltPassword = `${password}${salt}`;
    const saltPasswordSHA1 = sha1.update(saltPassword).digest('hex');
    const saltPasswordMd5 = md5.update(saltPasswordSHA1).digest('hex');
    return saltPasswordMd5;
};

export default class UsersController extends Controller {
    // public async index() {
    //     const { ctx } = this;
    //     ctx.body = await ctx.service.test.sayHi('egg');
    // }

    public async create() {
        const { ctx } = this;
        const { model, service } = ctx;
        ctx.validate(createRule, ctx.request.body);
        const { name, password, description } = ctx.request.body;
        // If the user is already exist.
        const isExist = (await model.Users.count({ where: { name } })) > 0;
        if (isExist) {
            service.responseHelper.handleResponse(ctx, 409);
            return;
        }
        // Encrypted password
        const salt = crypto.randomBytes(32).toString();
        const saltPassword = encryptPassword(password, salt);
        try {
            const result = await model.Users.create({
                name,
                password: saltPassword,
                description,
                salt,
            });
            service.responseHelper.handleResponse(ctx, 201, {
                data: pick(result, ['name', 'description', 'createdAt', 'updatedAt']),
            });
        } catch (e) {
            service.responseHelper.handleResponse(ctx, 500);
        }
    }
}
