module.exports.paginationTree = (query, final) => {
    const page = parseInt(query.page) || 1;

    const res = {
        page: page,
        final: final
    };

    return res;
}