const checkItems = document.querySelectorAll('input[name="checkitem"]'); // input checkbox 1 product
const changeProductCheckedForm = document.querySelector('form[changeProductChecked]'); //form change product checked
const checkedInput = document.querySelector('input[checkedInput]'); // checked input

if (checkItems) {
    checkItems.forEach(item => {
        item.addEventListener("change", () => {
            const parentForm = item.parentElement;
            parentForm.submit();
        });
    });
}