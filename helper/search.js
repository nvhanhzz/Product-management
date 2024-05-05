module.exports.search = (query) => {
    const keyword = query.keyword;
    const regex = new RegExp(keyword, "i");

    const res = {};
    if (keyword) {
        res.regex = regex;
        res.keyword = keyword;
    }

    return res;
}