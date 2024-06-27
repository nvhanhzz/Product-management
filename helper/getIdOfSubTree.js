const dfs = (tree, listId) => {
    listId.push(tree.id);
    for (const subTree of tree.child) {
        dfs(subTree, listId);
    }
}

module.exports.getIds = (tree) => {
    const listId = [];
    dfs(tree, listId);
    return listId;
}