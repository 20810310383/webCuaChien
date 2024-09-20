function validateForm_Update_KH() {
    var password = document.getElementById('MatKhau').value;
    var HoTen = document.getElementById('HoTen').value;
    var isValid = true;

    //  kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt
    var HoTenRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!HoTenRegex.test(HoTen)) {
        document.getElementById('name-error').innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('name-error').innerHTML = '';
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


function updateUser(id) {
    // Kiểm tra hợp lệ của dữ liệu
    if (!validateForm_Update_KH()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    // Lấy các giá trị từ form
    const TenDangNhap = document.getElementById('TenDangNhap').value;
    const HoTen = document.getElementById('HoTen').value;
    const MatKhau = document.getElementById('MatKhau').value;

    // Dữ liệu cập nhật
    const updateData = {
        TenDangNhap: TenDangNhap,
        HoTen: HoTen,
        MatKhau: MatKhau
    };

    fetch(`/update-tk-kh/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Thành Công!',
                text: data.message,
                confirmButtonText: 'OK'
            })
            .then(() => {                    
                window.location.href = '/page-qly-tkkh';
            });
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi chỉnh sửa. Vui lòng thử lại sau.',
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


function validateForm_Update_Admin() {
    var HoTen = document.getElementById('HoTen').value;
    var password = document.getElementById('MatKhau').value;
    var isValid = true;


    //  kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt
    var HoTenRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!HoTenRegex.test(HoTen)) {
        document.getElementById('name-error').innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('name-error').innerHTML = '';
    }

    // Kiểm tra mật khẩu: Tối thiểu 8 ký tự, ít nhất một chữ cái và một số:
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('password-error').innerHTML = 'Password không hợp lệ. Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số\n ';
        isValid = false;
    } else {
        document.getElementById('password-error').innerHTML = '';
    }

    return isValid;
}

function updateAdmin(id) {
    // Kiểm tra hợp lệ của dữ liệu
    if (!validateForm_Update_Admin()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }
    
    // Lấy các giá trị từ form
    const TenDangNhap = document.getElementById('TenDangNhap').value;
    const HoTen = document.getElementById('HoTen').value;
    const MatKhau = document.getElementById('MatKhau').value;
    const Deleted = document.getElementById('Deleted').value;

    // Dữ liệu cập nhật
    const updateData = {
        TenDangNhap: TenDangNhap,
        HoTen: HoTen,
        MatKhau: MatKhau,
        deleted: Deleted
    };

    fetch(`/update-tk-admin/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Thành Công!',
                text: data.message,
                confirmButtonText: 'OK'
            })
            .then(() => {                    
                window.location.href = '/page-qly-tkadmin';
            });
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi chỉnh sửa. Vui lòng thử lại sau.',
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

