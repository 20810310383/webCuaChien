function validateForm() {
    var username = document.getElementById('TenDangNhap').value;
    var HoTen = document.getElementById('HoTen').value;
    var password = document.getElementById('MatKhau').value;
    var isValid = true;

    // Kiểm tra tên người dùng: không viết hoa, không có dấu, tối thiểu 6 kí tự
    var usernameRegex = /^[a-z0-9]{6,}$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('username-error').innerHTML = 'Username không hợp lệ. Không được viết hoa và có dấu, tối thiểu 6 kí tự';
        isValid = false;
    } else {
        document.getElementById('username-error').innerHTML = '';
    }

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

// nút tạo tài khoản admin
function createAdmin() {
    // Kiểm tra hợp lệ của dữ liệu
    if (!validateForm()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    // Lấy các giá trị từ form
    const TenDangNhap = document.getElementById('TenDangNhap').value;
    const HoTen = document.getElementById('HoTen').value;
    const MatKhau = document.getElementById('MatKhau').value;

    // Dữ liệu cập nhật
    const createData = {
        TenDangNhap: TenDangNhap,
        HoTen: HoTen,
        MatKhau: MatKhau
    };

    fetch(`/create-tk-admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
                text: data.message,
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// nút thêm tài khoản admin khi phân quyền
let chucNangIds = [];
function createAdminPhanQuyen() {

    // Lấy các giá trị từ form
    const TenDangNhap = document.getElementById('TenDangNhap').value;
    const ChucNang = document.querySelectorAll('input[name="ChucNang"]:checked');
    const GhiChu = document.getElementById('GhiChu').value;

    ChucNang.forEach((checkbox) => {
        chucNangIds.push(checkbox.value);
    });

    // Dữ liệu cập nhật
    const createData = {
        TenDangNhap: TenDangNhap,
        ChucNang: chucNangIds,
        GhiChu: GhiChu
    };

    fetch(`/create-admin-phan-quyen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
                window.location.href = '/page-qly-tkadmin-phan-quyen';
            });
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: data.message,
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
