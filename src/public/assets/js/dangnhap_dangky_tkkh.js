document.addEventListener('DOMContentLoaded', function () {
    // phan dang ky tai khoan khach hang
    const registerForm = document.getElementById('register-form');
    const statusMessage = document.getElementById('statusMessage');
    const emaildk = document.getElementById('emaildk');
    
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const response = await fetch('/dang-ky-tkkh', {
            method: 'POST',
            body: formData
        });

        const responseData = await response.json();

        // Display message
        statusMessage.textContent = responseData.message;
        statusMessage.style.color = responseData.success ? 'blue' : 'red';

        if(responseData.success) {
            // Reset form after 3 seconds
            setTimeout(function () {
                statusMessage.textContent = ''; // Clear the message
                statusMessage.style.color = ''; // registerForm.reset(); 
                registerForm.reset(); // Reset form fields 
            }, 3000);
        } else {
            // Reset form after 3 seconds
            setTimeout(function () {
                statusMessage.textContent = ''; // Clear the message
                statusMessage.style.color = ''; // registerForm.reset();                                                             
                emaildk.value = ''; 
            }, 3000);
        }        
    });

    // phan dang nhap tai khoan khach hang
    const loginform = document.getElementById('login-form');
    const statusMessageLogin = document.getElementById('statusMessageLogin');    

    loginform.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(loginform);
        const response = await fetch('/dang-nhap-tkkh', {
            method: 'POST',
            body: formData
        });

        const responseData = await response.json();

        // Display message
        statusMessageLogin.textContent = responseData.message;
        statusMessageLogin.style.color = responseData.success ? 'blue' : 'red';

        if(responseData.success) {
            // Reset form after 3 seconds
            setTimeout(function () {
                statusMessageLogin.textContent = ''; // Clear the message
                statusMessageLogin.style.color = ''; 
                loginform.reset(); // Reset form fields 
            }, 3000);
            window.location.href = '/';
        } else {
            // Reset form after 3 seconds
            setTimeout(function () {
                statusMessageLogin.textContent = ''; // Clear the message
                statusMessageLogin.style.color = '';                                                          
                loginform.reset(); // Reset form fields 
            }, 3000);
        }        
    });    

    // lấy lại mật khẩu
    const doimk = document.getElementById('doi-mk');
    doimk.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(doimk);
        const response = await fetch('/quen-mat-khau', {
            method: 'POST',
            body: formData
        });

        const responseData = await response.json();

        if(responseData.success) {

            $('#exampleModalCenter').modal('hide');

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr["success"](responseData.message, "Thành Công!")
            // Xóa giá trị trong input email
            $('input[name="email_doimk"]').val('');
            // setTimeout(function() {
            //     toastr.clear();
            //     window.location.reload()
            // }, 2000);

        } else {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr["error"](responseData.message, "Xem lại Email của bạn!")

        }        
    });
});



                                            
                                     