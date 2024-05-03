module.exports.search = (req) => {
    const keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");

    const res = {};
    if (keyword) {
        res.regex = regex;
        res.keyword = keyword;
    }

    return res;
}