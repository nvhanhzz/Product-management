const url = new URL(window.location.href);
const activeButtons = document.querySelectorAll(".btn-active"); // 3 button filter what product active?
const searchForm = document.querySelector("#form-search"); // form search product
const pageButtons = document.querySelectorAll(".pagination-button"); // list pagination buttons
const statusButtons = document.querySelectorAll(".badge"); // list status button
const changeStatusForm = document.querySelector(".change-status-form"); // form change status of 1 product
const checkAll = document.querySelector('input[name="checkall"]'); // input checkbox check all
const checkItems = document.querySelectorAll('input[name="checkitem"]'); // input checkbox 1 product
const inputChangeListProduct = document.querySelector('input[name="inputChangeListProduct"]'); // input text change list product
const formChangeListProduct = document.querySelector('#change-product-form'); // form change list product
const selectChangeProduct = document.querySelector('.select-change-product'); // select change product
const deleteButtons = document.querySelectorAll('button[delete-button]'); // list delete button
const deleteProductForm = document.querySelector('.delete-product-form'); // delete form
const positionInput = document.querySelector('input[name="inputProductPosition"]'); // input position of product
const positionProducts = document.querySelectorAll('.position-product'); // list poition
const updateButtons = document.querySelectorAll('button[update-button]'); // list update button

// solve filter

for (let btn of activeButtons) {
    btn.addEventListener("click", () => {
        url.searchParams.delete("page"); // back to page 1
        const btnStt = btn.getAttribute("status");
        if (btnStt) {
            url.searchParams.set("status", btnStt);
            window.location.href = url.href;
        } else {
            url.searchParams.delete("status");
            window.location.href = url.href;
        }
    })
}

// solve search

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.querySelector(".form-control");
        if (input.value) {
            url.searchParams.set("keyword", input.value.trim());
            window.location.href = url.href;
        } else {
            url.searchParams.delete("keyword");
            window.location.href = url.href;
        }
    })
}

// solve pagination

for (let btn of pageButtons) {
    btn.addEventListener("click", () => {
        const pageNum = btn.getAttribute("pagenum");
        url.searchParams.set("page", pageNum);
        window.location.href = url.href;
    })
}

// solve change status of product

for (let btn of statusButtons) {
    btn.addEventListener("click", () => {
        const status = btn.getAttribute("val") === "active" ? "inactive" : "active";
        const itemId = btn.getAttribute("itemId");
        const oldAction = changeStatusForm.getAttribute("action");
        // console.log(oldAction);
        const changStatusPath = `${oldAction}/${status}/${itemId}?_method=PATCH`;
        changeStatusForm.setAttribute("action", changStatusPath);
        // console.log(changeStatusForm);
        changeStatusForm.submit();
    })
}

// solve change list product

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

formChangeListProduct.addEventListener("submit", (event) => {
    event.preventDefault();
    const listIdChange = Array.from(checkItems)
        .filter(item => item.checked)
        .map(item => item.getAttribute("val"));
    inputChangeListProduct.value = listIdChange.join(", ");
    const changeCase = selectChangeProduct.value.toLowerCase().replace(/\s/g, '_');;
    // console.log(changeCase);

    if (changeCase === 'change_position') {
        const listPosition = Array.from(checkItems)
            .filter(item => item.checked)
            .map(item => item.parentNode.parentNode.querySelector('.position-product').value)

        positionInput.value = listPosition.join(', ');
        // console.log(positionInput.value);
    }

    const formChangeListProductPath = `/admin/products/change-list-product/${changeCase}?_method=PATCH`;

    formChangeListProduct.setAttribute("action", formChangeListProductPath);
    // console.log(formChangeListProduct);
    if (changeCase != "") {
        const confirmed = confirm("Are you sure you want to change products?");
        if (confirmed) {
            formChangeListProduct.submit();
        }
    }
});

// solve delete 1 product
deleteButtons.forEach(item => {
    item.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete the product?");
        if (confirmed) {
            const id = item.getAttribute("item_id");
            const action = `/admin/products/delete-product/${id}?_method=DELETE`;
            deleteProductForm.setAttribute("action", action);
            // console.log(deleteProductForm);
            deleteProductForm.submit();
        }
    });
});

// solve update 1 product
updateButtons.forEach(item => {
    item.addEventListener("click", () => {
        const productId = item.getAttribute("item_id");
        window.location.href = `/admin/products/update-product/${productId}`;
    })
})