// Common index validate rule
const commonIndexRule = {
    pageSize: { type: 'int?', convertType: 'int' },
    currentPage: { type: 'int?', convertType: 'int' },
    sort: 'string?',
};

export { commonIndexRule };
