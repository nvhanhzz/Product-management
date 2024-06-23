const createTree = (listCategory, check, currentCategoryIndex) => {
    check[currentCategoryIndex] = true;
    listCategory[currentCategoryIndex].child = [];
    for (let i = 0; i < listCategory.length; ++i) {
        if (!check[i] && listCategory[i].parentId === listCategory[currentCategoryIndex].id) {
            listCategory[currentCategoryIndex].child.push(listCategory[i]);
            createTree(listCategory, check, i);
        }
    }
}

module.exports.tree = (listCategory) => {
    let check = [...Array(listCategory.length)].map(() => false);

    let resultTree = [];

    for (let i = 0; i < listCategory.length; ++i) {
        if (!check[i]) {
            createTree(listCategory, check, i);
            resultTree.push(listCategory[i]);
        }
    }

    return resultTree;
}