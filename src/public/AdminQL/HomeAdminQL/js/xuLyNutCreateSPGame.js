document.addEventListener('DOMContentLoaded', function() {
    const btnSubmit = document.getElementById('createSPForm');

    btnSubmit.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

        // Lấy các giá trị từ form
        const TenSP = document.getElementById('TenSP').value;
        const IdLoaiSP = document.getElementById('IdLoaiSP').value;
        const GiaBan = document.getElementById('GiaBan').value;
        const GiaCu = document.getElementById('GiaCu').value;
        // const MoTa = document.getElementById('MoTa').value;
        // Lấy giá trị từ CKEditor
        const MoTa = CKEDITOR.instances.MoTa.getData();
        const New_Hot = document.getElementById('New_Hot').value;
        const SpMoi_SpNoiBat = document.getElementById('SpMoi_SpNoiBat').value;
        const IdNam_Nu = document.getElementById('IdNam_Nu').value;
        const Image = document.getElementById('Image').files[0]; // Đây là file ảnh
        const Image1 = document.getElementById('Image1').files[0]; // Đây là file ảnh
        const Image2 = document.getElementById('Image2').files[0]; // Đây là file ảnh
        

        // Tạo formData để chứa dữ liệu form và file ảnh
        const formData = new FormData();
        formData.append('TenSP', TenSP);
        formData.append('IdLoaiSP', IdLoaiSP);
        formData.append('GiaBan', GiaBan);
        formData.append('GiaCu', GiaCu);
        formData.append('MoTa', MoTa);
        formData.append('New_Hot', New_Hot);
        formData.append('SpMoi_SpNoiBat', SpMoi_SpNoiBat);
        formData.append('IdNam_Nu', IdNam_Nu);
        formData.append('Image', Image);
        formData.append('Image1', Image1);
        formData.append('Image2', Image2);

        // Gửi request fetch để tạo mới sản phẩm
        fetch('/create-sp-game', {
            method: 'POST',
            body: formData
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
                    window.location.href = '/page-qly-game';
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
    });
});