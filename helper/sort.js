module.exports.sort = (query) => {
    const sortKey = query.sortKey;
    const sortValue = query.sortValue;

    let res = {};
    if (sortKey && sortValue && ['position', 'title', 'price'].includes(sortKey) && ['asc', 'desc'].includes(sortValue)) {
        res[sortKey] = sortValue;
    } else {
        res = { position: "desc" };
    }

    return res;
}