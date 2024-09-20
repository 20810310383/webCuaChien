
// sử dụng thư viện toastr để thông báo khi xoá thành công 
function deleteSP(userId) {
    // if (confirm("Bạn có chắc chắn muốn xóa?")) {
        fetch(`/xoa-sp-nuoc-hoa/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // Có thể thêm các tùy chọn khác như body nếu cần
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

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
                toastr["success"](data.message, "Thành Công!")
                setTimeout(function() {
                    toastr.clear();
                    window.location.reload();
                }, 1500); 
            } else {
                // Show error alert
                toastr.error('Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.', 'Lỗi!');
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    // }
}


// sử dụng thư viện sweetalert2 để thông báo khi xoá thành công 
function deleteSP1(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        fetch(`/xoa-sp-nuoc-hoa/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // Có thể thêm các tùy chọn khác như body nếu cần
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
                    window.location.reload(); // Tải lại trang hiện tại
                });
            } else {                
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.',
                    confirmButtonText: 'OK SHOP'
                });                       
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}


// xoá loại sản phẩm
function deleteLoaiSP(userId) {
    // if (confirm("Bạn có chắc chắn muốn xóa?")) {
        fetch(`/xoa-loaisp-nuoc-hoa/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // Có thể thêm các tùy chọn khác như body nếu cần
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

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
                toastr["success"](data.message, "Thành Công!")
                setTimeout(function() {
                    toastr.clear();
                    window.location.reload();
                }, 1500); 
            } else {
                // Show error alert
                toastr.error('Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.', 'Lỗi!');
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    // }
}