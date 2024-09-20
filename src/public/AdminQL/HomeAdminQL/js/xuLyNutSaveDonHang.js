function updateDonHang(id) {
    
    // Lấy các giá trị từ form
    const TinhTrangDonHang = document.getElementById('TinhTrangDonHang').value;
    const TinhTrangThanhToan = document.getElementById('TinhTrangThanhToan').value;
    

    // Dữ liệu cập nhật
    const updateData = {
        TinhTrangDonHang: TinhTrangDonHang,
        TinhTrangThanhToan: TinhTrangThanhToan,       
    };

    fetch(`/update-HoaDon/${id}`, {
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
                window.location.href = '/ql-don-hang';
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
