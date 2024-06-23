tinymce.init({
    selector: 'textarea#my-expressjs-tinymce-app',
    plugins: 'lists link image table code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image',
    automatic_uploads: false,
    file_picker_types: 'image',
    file_picker_callback: function (callback, value, meta) {
        if (meta.filetype === 'image') {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
                var file = this.files[0];
                var reader = new FileReader();

                reader.onload = function () {
                    var base64 = reader.result;
                    callback(base64, { alt: file.name });
                };

                reader.readAsDataURL(file);
            };

            input.click();
        }
    }
});
