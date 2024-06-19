const url = new URL(window.location.href);
const products = document.querySelectorAll(".product-item"); //list product;
const pageButtons = document.querySelectorAll(".pagination-button"); // list pagination buttons


// solve show product detail

products.forEach(item => {
    item.addEventListener("click", () => {
        window.location.href = `/products/${item.getAttribute("slug")}`;
    })
})

// solve pagination

for (let btn of pageButtons) {
    btn.addEventListener("click", () => {
        const pageNum = btn.getAttribute("pagenum");
        url.searchParams.set("page", pageNum);
        window.location.href = url.href;
    })
}


// phần tăng giảm số lượng sản phẩm phía người dùng thì để khi nào làm cart xử lý cùng luôn
