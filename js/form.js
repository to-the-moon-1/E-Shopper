$('.form-control').on ('click', function () {
    $(this).css ("border-color", "#ccc");
});

$('#send').on ('click', function (e) {

    e.preventDefault();

    var name = $('#name').val();
    var email = $('#email').val();
    var topic = $('#topic').val();
    var message = $('#message').val();

    $.ajax({
        url: '/ajax/contact-us.php',
        type: 'POST',
        cache: false,
        data: {'name': name, 'email': email, 'topic': topic, 'message': message},
        dataType: 'html',
        beforeSend: function () {
            $('#send').attr("disabled", "disabled");
        },
        success: function (data) {
            if (data == true) {
                $('#name').val ("");
                $('#email').val ("");
                $('#topic').val ("");
                $('#message').val ("");
                $('#send').text ("Сообщение отправлено");
                $('#name').css ("border-color", "#60fc8c");
                $('#email').css ("border-color", "#60fc8c");
                $('#topic').css ("border-color", "#60fc8c");
                $('#message').css ("border-color", "#60fc8c");
            } else {
                if (data == false)
                    alert ("Что-то пошло не так! Сообщение не отправлено");
                else {
                    switch (data) {
                        case "Имя не указано":
                            $('#name').css ("border-color", "#f7b4b4");
                            break;
                        case "Неправильный e-mail":
                            $('#email').css ("border-color", "#f7b4b4");
                            break;
                        case "Тема не указана":
                            $('#topic').css ("border-color", "#f7b4b4");
                            break;
                        case "Сообщение не указано":
                            $('#message').css ("border-color", "#f7b4b4");
                            break;
                        default:
                            $('#name').css ("border-color", "#f7b4b4");
                            $('#email').css ("border-color", "#f7b4b4");
                            $('#topic').css ("border-color", "#f7b4b4");
                            $('#message').css ("border-color", "#f7b4b4");
                    }
                }
            }
            $('#send').removeAttr ("disabled");
        }
    });
});