$(".form-control").on("click",(function(){$(this).css("border-color","#ccc")})),$("#send").on("click",(function(e){e.preventDefault();var c=$("#name").val(),o=$("#email").val(),s=$("#topic").val(),a=$("#message").val();$.ajax({url:"/ajax/contact-us.php",type:"POST",cache:!1,data:{name:c,email:o,topic:s,message:a},dataType:"html",beforeSend:function(){$("#send").attr("disabled","disabled")},success:function(e){if(1==e)$("#name").val(""),$("#email").val(""),$("#topic").val(""),$("#message").val(""),$("#send").text("Сообщение отправлено"),$("#name").css("border-color","#60fc8c"),$("#email").css("border-color","#60fc8c"),$("#topic").css("border-color","#60fc8c"),$("#message").css("border-color","#60fc8c");else if(0==e)alert("Что-то пошло не так! Сообщение не отправлено");else switch(e){case"Имя не указано":$("#name").css("border-color","#f7b4b4");break;case"Неправильный e-mail":$("#email").css("border-color","#f7b4b4");break;case"Тема не указана":$("#topic").css("border-color","#f7b4b4");break;case"Сообщение не указано":$("#message").css("border-color","#f7b4b4");break;default:$("#name").css("border-color","#f7b4b4"),$("#email").css("border-color","#f7b4b4"),$("#topic").css("border-color","#f7b4b4"),$("#message").css("border-color","#f7b4b4")}$("#send").removeAttr("disabled")}})}));