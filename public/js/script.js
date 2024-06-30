const url = new URL(window.location.href);
const products = document.querySelectorAll(".product-item"); //list product;
const pageButtons = document.querySelectorAll(".pagination-button"); // list pagination buttons
const outerProduct = document.querySelector(".outer-product");
const imgInputs = document.querySelectorAll(".imp-inp");
const blah = document.querySelector("#blah");

// solve image upload preview
imgInputs.forEach(item => {
    item.addEventListener("change", (e) => {
        const [file] = e.target.files;
        if (file) {
            blah.src = URL.createObjectURL(file);
            blah.style.display = "block";
        }
    })
});

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

// solve css header
outerProduct.addEventListener("mouseenter", () => {
    console.log("1");
    const subTree = outerProduct.querySelectorAll(".sub-tree");
    subTree.forEach(item => {
        item.classList.remove("child");
    })
});

outerProduct.addEventListener("mouseleave", () => {
    const subTree = outerProduct.querySelectorAll(".sub-tree");
    subTree.forEach(item => {
        item.classList.add("child");
    })
});

// solve alert notification

document.addEventListener('DOMContentLoaded', function () {
    const alert = document.querySelector('.notfAlert');
    if (alert) {
        setTimeout(function () {
            alert.style.display = 'none';
        }, 5000);

        const closeAlertBtn = document.querySelector('.close-alert-btn');
        if (closeAlertBtn) {
            closeAlertBtn.addEventListener('click', function () {
                alert.style.display = 'none';
            });
        }
    }
});


// phần tăng giảm số lượng sản phẩm phía người dùng thì để khi nào làm cart xử lý cùng luôn
