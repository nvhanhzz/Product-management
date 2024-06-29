const buyNowButton = document.querySelector('button[buy-now]');
const quantityInput = document.querySelector('input[quantity]');

if (buyNowButton) {
    buyNowButton.addEventListener("click", (e) => {
        e.preventDefault();

        const quantity = quantityInput.value;
        const form = buyNowButton.parentElement;
        const oldAction = form.getAttribute("action");
        form.setAttribute("action", `${oldAction}/${quantity}`);

        form.submit();
    });
}