function validateForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var isValid = true;

    // Kiểm tra tên người dùng: không viết hoa, không có dấu
    var usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('username-error').innerHTML = 'Username không hợp lệ. Không được viết hoa và có dấu';
        isValid = false;
    } else {
        document.getElementById('username-error').innerHTML = '';
    }

    // Kiểm tra mật khẩu: Tối thiểu tám ký tự, ít nhất một chữ cái và một số:
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('password-error').innerHTML = 'Password không hợp lệ. Tối thiểu tám ký tự, ít nhất một chữ cái và một số\n ';
        isValid = false;
    } else {
        document.getElementById('password-error').innerHTML = '';
    }

    return isValid;
}