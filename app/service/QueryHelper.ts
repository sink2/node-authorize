import { Service } from 'egg';
import { omit } from 'lodash';

type Order = string[];
type SortOrder = 'ASC' | 'DESC';
type Reduce = (record: any) => any;
interface Attributes {
    include?: string[];
    exclude?: string[];
}
interface QueryCondition {
    limit?: number;
    offset?: number;
    where?: object;
    order?: Order[];
    attributes?: string[] | Attributes;
}

export default class QueryHelper extends Service {
    /**
     * @description 通用资源列表查询
     * @param {Model} model - Model.
     * @param {QueryParams} [query] - Query paramaters.
     * @param {string[]} [include = []] - The collection of include column.Notice: If include is not empty, the sort column should be in the scope.
     * @param {string[]} [exclude = []] - The collection of exclude column.Notice: If exclude is not empty, the sort column should not be in the scope.
     * @param {Reduce} [reduce = record => record] - The callback function for each row.
     * @return {Array<any>} - Query result.
     */
    public async queryAll(model: any, query: QueryParams, include: string[] = [], exclude: string[] = [], reduce: Reduce = record => record) {
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
            // The sort column should be in `include` collection and should not be in `exclude` collection
            if ((include.length > 0 && include.indexOf(sortColumn) !== -1) && (exclude.length > 0 && exclude.indexOf(sortColumn) === -1)) {
                queryParams.order = [[sortColumn, sortOrder]];
            }
        }
        // Handle condition
        queryParams.where = omit(query, ['pageSize', 'currentPage', 'sort']);
        // Handle attributes
        queryParams.attributes = {};
        if (include.length > 0) {
            queryParams.attributes.include = include;
        }
        if (exclude.length > 0) {
            queryParams.attributes.exclude = exclude;
        }
        const totalCount = await model.count();
        const result = await model.findAndCountAll(queryParams);
        return {
            total: totalCount,
            filtered: result.count,
            data: result.rows.map(row => reduce(row.dataValues)),
        };
    }

    /**
     * @description 查询单条记录
     * @param {Model} model - Model.
     * @param {string} value - Value.
     * @param {string[]} [include = []] - The collection of include column.Notice: If include is not empty, the sort column should be in the scope.
     * @param {string[]} [exclude = []] - The collection of exclude column.Notice: If exclude is not empty, the sort column should not be in the scope.
     * @param {string} [primaryKey=id] - Primary key. Default: id
     * @return {object} - Query result.
     */
    public async queryOne(model: any, value: string, include: string[] = [], exclude: string[] = [], primaryKey: string = 'id') {
        const queryParams: QueryCondition = { where: { [primaryKey]: value } };
        queryParams.attributes = {};
        if (include.length > 0) {
            queryParams.attributes.include = include;
        }
        if (exclude.length > 0) {
            queryParams.attributes.exclude = exclude;
        }
        const result = await model.findOne(queryParams);
        return result.dataValues;
    }
}
