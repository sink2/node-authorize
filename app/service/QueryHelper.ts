import { Service } from 'egg';
import { omit } from 'lodash';

type Order = string[];

type SortOrder = 'ASC' | 'DESC';

interface QueryCondition {
    limit?: number;
    offset?: number;
    where?: object;
    order?: Order[];
    attributes?: string[];
}

export default class QueryHelper extends Service {
    /**
     * @description 通用资源列表查询
     * @param {Model} model - Model.
     * @param {QueryParams} [query] - Query paramaters.
     * @param {string[]} [attributes = []] - The collection of attributes.Notice: If attributes is not empty, the sort column should be in the scope.
     * @return {Array<any>} - Query result.
     */
    public async queryAll(model: any, query: QueryParams, attributes: string[] = []) {
        const { pageSize, currentPage, sort } = query;
        const queryParams: QueryCondition = {};
        // Handle offset and limit
        if (pageSize && currentPage) {
            queryParams.limit = pageSize * 1;
            queryParams.offset = (currentPage - 1) * pageSize;
        }
        // Handle order
        if (sort) {
            const matchOrderChar = sort.match(/(?<=-)\S*/);
            const sortOrder: SortOrder = matchOrderChar ? 'DESC' : 'ASC';
            const sortColumn: string = (sortOrder === 'DESC' ? (matchOrderChar && matchOrderChar[0]) : sort) || '';
            // Prevent out-of-range display column to be sorted.
            if (attributes.length > 0 && attributes.indexOf(sortColumn) !== -1) {
                queryParams.order = [[sortColumn, sortOrder]];
            }
        }
        // Handle condition
        queryParams.where = omit(query, ['pageSize', 'currentPage', 'sort']);
        // Handle attributes
        if (attributes.length > 0) {
            queryParams.attributes = attributes;
        }
        const totalCount = await model.count();
        const result = await model.findAndCountAll(queryParams);
        return {
            total: totalCount,
            filtered: result.count,
            data: result.rows,
        };
    }

    public queryOne() {

    }
}
