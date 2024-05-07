const url = new URL(window.location.href);
const activeButtons = document.querySelectorAll(".btn-active"); // 3 button filter what product active?
const searchForm = document.querySelector("#form-search"); // form search product
const pageButtons = document.querySelectorAll(".pagination-button"); // list pagination buttons
const statusButtons = document.querySelectorAll(".badge"); // list status button
const changeStatusForm = document.querySelector(".change-status-form");

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
        console.log(oldAction);
        const changStatusPath = `${oldAction}/${status}/${itemId}?_method=PATCH`;
        changeStatusForm.setAttribute("action", changStatusPath);
        // console.log(changeStatusForm);
        changeStatusForm.submit();
    })
}