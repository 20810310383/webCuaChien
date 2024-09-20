function togglePassword(index, actualPassword) {
    var passwordSpan = document.getElementById('password' + index);
    var toggleIcon = document.getElementById('togglePasswordIcon' + index);

    // Toggle password visibility
    if (passwordSpan.innerHTML === '********') {
        passwordSpan.innerHTML = actualPassword; // Display the actual password
        toggleIcon.className = 'fas fa-eye'; // Icon when password is visible
    } else {
        passwordSpan.innerHTML = '********'; // Hide the actual password
        toggleIcon.className = 'fas fa-eye-slash'; // Icon when password is hidden
    }
}