$(document).ready(function(){
    $('#register').submit(function(event){
        event.preventDefault(); // Prevent the form from submitting normally

        const username = $('#name').val();
        const password = $('#pw').val();
        const cpassword = $('#cpw').val();

        if (password===cpassword){
            $.ajax({ //hindi magrerefresh yung page pero may gagawin cya.
                url: '/create-account', //tatawagin yung API sa app js.
                type: 'POST',
                contentType: 'application/json', //si json taga bato.
                data: JSON.stringify({ //nilalagyan niya ng data yung json file na ibabato doon sa API app.js
                    username: username,
                    password: password
                }),
                success: function(response){
                    alert(response.message);
                    $('#register')[0].reset(); // Reset the form after successful submission
                },
                error: function(error){
                    alert('Error creating account');
                }
            });
        }else{
            alert("Mismatch by Mcdo");
        }

       
    });

    $('#login').submit(function(event){
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url:'/login',
            type:'POST',
            contentType:'application/json',
            data:JSON.stringify({
                username: username,
                password:password
            }),
            success: function(response){
                if (response.message ==='Login Successfully'){
                    alert(response.message);
                    window.location.href=response.redirectUrl;
                }else{
                    alert(response.message);
                }
            },
            error: function(error){
                alert('Error login account');
            }

        });
        
    });
});


