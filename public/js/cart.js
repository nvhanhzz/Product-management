const checkAll = document.querySelector('input[name="checkall"]'); // input checkbox check all
const checkItems = document.querySelectorAll('input[name="checkitem"]'); // input checkbox 1 product

if (checkAll) {
    checkAll.addEventListener("click", () => {
        if (checkAll.checked) {
            checkItems.forEach(item => {
                item.checked = true;
            })
        } else {
            checkItems.forEach(item => {
                item.checked = false;
            })
        }
    });
}

if (checkItems) {
    checkItems.forEach(item => {
        item.addEventListener("click", () => {
            const numChange = Array.from(checkItems).reduce((accumulator, currentValue) => {
                return currentValue.checked ? accumulator + 1 : accumulator;
            }, 0);

            if (numChange === checkItems.length) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        });
    });

}