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

if (blah && blah.getAttribute("src") !== "#" && blah.getAttribute("src") !== "https://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=6&m=1216251206&s=612x612&w=0&h=G8kmMKxZlh7WyeYtlIHJDxP5XRGm9ZXyLprtVJKxd-o=") {
    blah.style.display = "block";
}

// solve alert notification

document.addEventListener('DOMContentLoaded', function () {
    const alert = document.querySelector('.notfAlert');
    if (alert) {
        setTimeout(function () {
            alert.style.display = 'none';
        }, 3000);

        const closeAlertBtn = document.querySelector('.close-alert-btn');
        if (closeAlertBtn) {
            closeAlertBtn.addEventListener('click', function () {
                alert.style.display = 'none';
            });
        }
    }
});