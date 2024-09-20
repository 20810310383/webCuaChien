document.addEventListener('DOMContentLoaded', function () {
    updateCTCart(); // Gọi hàm cập nhật thông tin giỏ hàng khi trang được tải

    async function updateCTCart() {
        try {
            const response = await fetch('/get-chi-tiet-cart'); // Gửi yêu cầu GET đến '/get-chi-tiet-cart'
            const data = await response.json(); // Chuyển đổi phản hồi thành JSON
            console.log("data => ", data);

            // Lặp qua từng sản phẩm trong giỏ hàng và hiển thị chúng
            const cartItemsContainer = document.querySelector('.mini_cart');
            // cartItemsContainer.innerHTML = ''; // Xóa nội dung hiện tại của mini_cart

            data.productDetails.forEach(product => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart_item');

                // Tạo phần tử cho hình ảnh
                const cartImg = document.createElement('div');
                cartImg.classList.add('cart_img');
                const imgLink = document.createElement('a');

                if (product.productDetails.IdLoaiSP.TenLoaiSP == "Avatar"){
                    imgLink.href = '/detailt-sp-ht2?idDetailtSP_ht2=' + product.productDetails._id;
                } else {
                    imgLink.href = '/detailt-sp-ht1?idDetailtSP=' + product.productDetails._id;
                }

                const img = document.createElement('img');
                img.src = 'images/upload/' + getRelativeImagePath(product.productDetails.Image);
                img.alt = '';
                imgLink.appendChild(img);
                cartImg.appendChild(imgLink);

                // Tạo phần tử cho thông tin sản phẩm
                const cartInfo = document.createElement('div');
                cartInfo.classList.add('cart_info');
                const productLink = document.createElement('a');
                
                if (product.productDetails.IdLoaiSP.TenLoaiSP == "Avatar"){
                    productLink.href = '/detailt-sp-ht2?idDetailtSP_ht2=' + product.productDetails._id;
                } else {
                    productLink.href = '/detailt-sp-ht1?idDetailtSP=' + product.productDetails._id;
                }
                productLink.textContent = product.productDetails.TenSP; 
                const cartPrice = document.createElement('span');
                cartPrice.classList.add('cart_price');
                cartPrice.textContent = formatCurrency(product.donGia); 
                const quantity = document.createElement('span');
                quantity.classList.add('quantity');
                quantity.textContent = 'Số lượng đặt: ' + product.qty;

                const size = document.createElement('span');
                size.classList.add('quantity');
                size.textContent = 'Size: ' + product.size;

                cartInfo.appendChild(productLink);
                cartInfo.appendChild(cartPrice);
                cartInfo.appendChild(quantity);
                cartInfo.appendChild(size);

                // Tạo phần tử cho nút xóa sản phẩm
                // const cartRemove = document.createElement('div');
                // cartRemove.classList.add('cart_remove');
                // const removeLink = document.createElement('a');
                // removeLink.href = '#';
                // const removeIcon = document.createElement('i');
                // removeIcon.classList.add('fa', 'fa-times-circle');
                // removeLink.appendChild(removeIcon);
                // removeLink.title = 'Xoá sản phẩm này';
                // cartRemove.appendChild(removeLink);

                // // Tạo phần tử cho nút xóa sản phẩm
                // const cartRemove = document.createElement('form');
                // cartRemove.action = '/remove-mot-sp'; // Đặt đường dẫn xử lý xóa sản phẩm ở đây
                // cartRemove.method = 'POST'; // Đặt phương thức HTTP của form
                // cartRemove.classList.add('cart_remove');

                // const removeButton = document.createElement('button');
                // removeButton.type = 'submit'; // Sử dụng button type để gửi form
                // removeButton.innerHTML = '<i class="fa fa-times-circle"></i>'; // HTML của nút xóa
                // removeButton.title = 'Xoá sản phẩm này';

                // // Thêm button vào trong form
                // cartRemove.appendChild(removeButton);

                // // Tạo phần tử input ẩn
                // const inputIdARemove = document.createElement('input');
                // inputIdARemove.type = 'hidden';
                // inputIdARemove.name = 'idARemove';
                // inputIdARemove.value = product.productDetails._id;

                // // Thêm input vào trong form
                // cartRemove.appendChild(inputIdARemove);

                // Thêm các phần tử vào phần tử cartItem
                cartItem.appendChild(cartImg);
                cartItem.appendChild(cartInfo);
                // cartItem.appendChild(cartRemove);

                // Thêm cartItem vào mini_cart
                cartItemsContainer.appendChild(cartItem);
            });

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin giỏ hàng:', error);
        }
    }

    // Hàm định dạng tiền tệ (có thể thay đổi theo định dạng tiền của bạn)
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // rút gọn file ảnh chỉ lấy tên ảnh, ví dụ: abc.png
    function getRelativeImagePath(absolutePath) {
        const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
        const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
        return relativePath;
    }
});