// phan dang nhap tai khoan admin
const loginform = document.getElementById('signin-form');

loginform.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(loginform);
    const response = await fetch('/login-admin', {
        method: 'POST',
        body: formData
    });

    const responseData = await response.json();   

    if(responseData.success) {
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
            "timeOut": "1500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["success"](responseData.message, "Thành Công!")
        setTimeout(function() {
            toastr.clear();
            window.location.href = '/home-page-admin';
        }, 1000);      
        
    } else {
        // Reset form after 3 seconds
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
        toastr["error"](responseData.message, "Đăng nhập không thành công")       
        setTimeout(function() {
            toastr.clear();
            loginform.reset(); // Reset form fields 
        }, 5000);                                             
        
    }        
});