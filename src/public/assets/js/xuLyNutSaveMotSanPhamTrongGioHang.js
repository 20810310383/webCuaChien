function updateCart(id) {

    // Lấy các giá trị từ form
    const PriceBanMoi = document.getElementsByName("PriceBanMoi")[0].value;
    const quantity = document.getElementsByName("quantity")[0].value;
    const group_2 = document.getElementById('group_2').value;

    // Dữ liệu cập nhật
    const updateData = {
        PriceBanMoi: PriceBanMoi,
        quantity: quantity,
        size: group_2
    };

    fetch(`/update-sp-cart/${id}`, {
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
                window.location.href = '/detailt-cart-trang-moi';
            });
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Hết hàng!',
                text: data.message,
                confirmButtonText: 'OK SHOP'
            })
            // .then(() => {                    
            //     location.reload(); // Làm mới trang
            // });                    
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}