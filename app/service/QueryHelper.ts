import { Service, Context } from 'egg';

export default class QueryHelper extends Service {
    public async queryAll(model, query: QueryParams) {
        return await model.findOne(query);
    }

    public queryOne() {

    }
}
