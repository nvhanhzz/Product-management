const url = new URL(window.location.href);

// solve filter
const activeButtons = document.querySelectorAll(".btn-active");

for (let btn of activeButtons) {
    btn.addEventListener("click", () => {
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

const searchForm = document.querySelector("#form-search");
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