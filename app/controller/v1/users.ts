import { Controller } from 'egg';
import * as crypto from 'crypto';
import { pick, omit } from 'lodash';
import { commonIndexRule } from '../validateConfig';

const indexRule = {
    ...commonIndexRule,
    id: 'string?',
    name: { type: 'string?', max: 64 },
    description: { type: 'string?', max: 256 },
};

const createRule = {
    name: { type: 'string', max: 64 },
    password: { type: 'string', max: 256 },
    description: { type: 'string?', max: 256 },
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
    public async index() {
        const { ctx } = this;
        const { service, model } = ctx;
        ctx.validate(indexRule, ctx.request.query);
        // Prevent extra parameters from getting database fields.
        const queryParams = pick(ctx.request.query, Object.keys(indexRule));
        try {
            const result = await service.queryHelper.queryAll(model.Users, queryParams, ['id', 'name', 'description', 'createdAt', 'updatedAt']);
            service.responseHelper.handleResponse(ctx, 200, result);
        } catch (e) {
            ctx.logger.error(e);
            service.responseHelper.handleResponse(ctx, 500);
        }
    }

    public async create() {
        const { ctx } = this;
        const { model, service } = ctx;
        ctx.validate(createRule, ctx.request.body);
        const { name, password, description } = ctx.request.body;
        const additionalInfo = omit(ctx.request.body, ['name', 'password', 'description']);
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
                additionalInfo: JSON.stringify(additionalInfo),
            });
            const data = omit(result.dataValues, ['password', 'salt', 'additionalInfo']);
            const additional = JSON.parse(result.additionalInfo);
            service.responseHelper.handleResponse(ctx, 201, {
                data: {
                    ...additional,
                    ...data,
                },
            });
        } catch (e) {
            ctx.logger.error(e);
            service.responseHelper.handleResponse(ctx, 500);
        }
    }

    public async destroy() {
        const { ctx } = this;
        const { model, service } = ctx;
        const { id } = ctx.params;
        try {
            const isExist = (await model.Users.count({ where: { id } })) > 0;
            if (!isExist) {
                service.responseHelper.handleResponse(ctx, 404);
            } else {
                const result = await model.Users.destroy({ where: { id } });
                service.responseHelper.handleResponse(ctx, 200, result);
            }
        } catch (e) {
            ctx.logger.error(e);
            service.responseHelper.handleResponse(ctx, 500);
        }
    }
}
