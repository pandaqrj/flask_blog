var app = new Vue({
    el: '#app',
    data: {
        topic_list1: null
        , topic_list2: null
        , author_id: null
        , edit_id: null
    }

});

axios.get("/apis/get_posts").then(
    function (response) {
        app.topic_list1 = response.data.topic_list1
        app.topic_list2 = response.data.topic_list2
        app.author_id = response.data.author_id
    }
).catch(function (error) {
    console.log(error);
});
ClassicEditor
    .create(document.querySelector('.editor'), {

        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'strikethrough',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'code',
                'codeBlock',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo'
            ]
        },
        language: 'zh-cn',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        licenseKey: '',

    })
    .then(editor => {
        window.editor = editor;

    })
    .catch(error => {
        console.error('Oops, something went wrong!');
        console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
        console.warn('Build id: m2c9we5mrugk-g8dnbe7ryv5g');
        console.error(error);
    });

$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes
    var title = button.data('title')
    var body = button.data('body')
    var type = button.data('type')
    var action = ''
    if (type == 'Edit Topic') {
        action = '/apis/' + id + '/update'
        var modal = $(this)
        modal.find('.modal-title').text(type)
        modal.find('.etdit-page #title').val(title)
        modal.find('.etdit-page form').attr('action', action)
        editor.setData(body)
    }
    if (type == 'Create New Topic') {
        action = '/apis/create'
        var modal = $(this)
        modal.find('.modal-title').text(type)
        modal.find('.etdit-page #title').val("")
        modal.find('.etdit-page form').attr('action', action)
        editor.setData("")
    }
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

});

