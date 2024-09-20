$(document).ready(function() {
    // Bắt sự kiện khi form được submit
    $('#form-addtocart').submit(function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
        
        // Lấy dữ liệu form
        const formData = $(this).serialize();
        // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
        addToCart(formData);
    });
});


// Hàm gửi yêu cầu thêm sản phẩm vào giỏ hàng và cập nhật thông tin giỏ hàng
function addToCart1(formData) {
    const quantity = parseInt($('input[name="quantity"]').val()); // Get the quantity from the form
    const SoLuongTon = parseInt('<%= productDetails.SoLuongTon %>'); // Get the available quantity from the server-side template

    if (isNaN(quantity) || quantity <= 0) {
        // Handle invalid quantity input
        console.error('Invalid quantity input');
        return;
    }

    if (quantity > SoLuongTon) {
        // If quantity exceeds available quantity, display an alert
        showCustomAlert_ThongBaoHetHang(`Số lượng sản phẩm này chỉ còn ${SoLuongTon}`);
        return;
    }

    $.ajax({
        url: '/addtocart?productId=<%= productDetails._id %>',
        type: 'POST',
        data: formData,
        success: function(response) {
            if (response.success) {    
                // Hiển thị thông báo khi thành công
                // alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
                showCustomAlert('Đã thêm sản phẩm vào giỏ hàng thành công!');
                
                // Chuyển hướng trang sau khi thêm vào giỏ hàng thành công
                // window.location.href = '/detailt-cart-trang-moi';
            } else {
                // Hiển thị thông báo lỗi từ server
                showCustomAlert_ThongBaoHetHang(response.message)
                //alert(response.message);
            }
        },
        error: function(error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    });
}

// test nhưng chưa chạy được, chưa thông báo khi hết số lượng tồn
function addToCart(formData) {
    fetch('/addtocart?productId=<%= productDetails._id %>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: data.message,
                confirmButtonText: 'Mua Tiếp'
            })
            .then(() => {
                window.location.reload(); // Reload the current page
            });
        } else {
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: data.message,
                confirmButtonText: 'OK SHOP'
            })
            .then(() => {
                window.location.reload(); // Reload the current page
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//********************************************* */
// Hàm hiển thị thông báo tùy chỉnh
function showCustomAlert(message) {
    const alertElement = document.getElementById('custom-alert');
    const messageElement = document.getElementById('alert-message');

    // Hiển thị thông báo và đặt nội dung
    alertElement.style.display = 'block';
    messageElement.innerText = message;

    // Ẩn thông báo sau một khoảng thời gian (ví dụ: 5 giây)
    setTimeout(() => {
        hideCustomAlert();
        window.location.href = '/detailt-cart-trang-moi';
        
    }, 1000);
}
function showCustomAlert_ThongBaoHetHang(message) {
    const alertElement = document.getElementById('custom-alert');
    const messageElement = document.getElementById('alert-message');

    // Hiển thị thông báo và đặt nội dung
    alertElement.style.display = 'block';
    messageElement.innerText = message;

    // Ẩn thông báo sau một khoảng thời gian (ví dụ: 5 giây)
    setTimeout(() => {
        hideCustomAlert();
        window.location.reload();
        
    }, 1000);
}

// Hàm ẩn thông báo tùy chỉnh
function hideCustomAlert() {
    const alertElement = document.getElementById('custom-alert');

    // Ẩn thông báo
    alertElement.style.display = 'none';
}