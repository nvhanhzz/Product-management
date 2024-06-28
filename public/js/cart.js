const checkItems = document.querySelectorAll('input[name="checkitem"]'); // input checkbox 1 product
const quantityInputs = document.querySelectorAll('input[quantity]'); // input checkbox 1 product
const changeProductCheckedForm = document.querySelector('form[changeProductChecked]'); //form change product checked
const checkedInput = document.querySelector('input[checkedInput]'); // checked input

// change check input of product in cart
if (checkItems) {
    checkItems.forEach(item => {
        item.addEventListener("change", () => {
            const parentForm = item.parentElement;
            parentForm.submit();
        });
    });
}

// change check input of product in cart
if (quantityInputs) {
    quantityInputs.forEach(item => {
        item.addEventListener("change", () => {
            const parentForm = item.parentElement;
            parentForm.submit();
        });
    });
}