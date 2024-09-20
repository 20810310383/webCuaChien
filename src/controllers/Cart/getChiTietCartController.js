const SanPham = require("../../models/SanPham")
const Cart = require("../../models/Cart")
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')();

// --------------------------------------

module.exports = {
    
    // hiển thị thông tin chi tiết giỏ hàng trên thanh công cụ
    getChiTietCart: async (req, res) => {
        try {
            const customerAccountId = req.session.userId;
            const detailCart = await Cart.findOne({ MaTKKH: customerAccountId }).exec();
    
            if (!detailCart) {
                console.log("Giỏ hàng trống");
                return res.json({ success: false, message: "Giỏ hàng trống" });
            }
    
            const cartItems = detailCart.cart.items;
            const productDetailsArray = await Promise.all(cartItems.map(async item => {
                // console.log(`item._id cần xóa: ${item._id}`); // xem id can xoa
    
                try {
                    const productDetails = await SanPham.findById(item.productId).populate('IdLoaiSP').exec();
                    // console.log("productDetails: ",productDetails);
    
                    if (productDetails) {
                        const { TenSP, GiaBan } = productDetails;
                        const totalPriceForItem = item.qty * item.donGia;
    
                        return {
                            productDetails,
                            qty: item.qty,
                            size: item.size,
                            donGia: item.donGia,
                            totalPriceForItem,
                            _id: item._id
                        };
                    } else {
                        console.log("Không tìm thấy chi tiết sản phẩm cho mặt hàng:", item.productId);
                        return null;
                    }
                } catch (error) {
                    console.error("Lỗi khi truy xuất chi tiết sản phẩm:", error);
                    return null;
                }
            }));
    
            const totalCartPrice = cartItems.reduce((acc, cur) => acc + cur.qty * cur.donGia, 0);
    
            res.json({
                success: true,
                productDetails: productDetailsArray.filter(Boolean),
                cartItemss: { items: cartItems, totalCartPrice: totalCartPrice }
            });
        } catch (error) {
            console.error("Lỗi khi truy xuất giỏ hàng:", error);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy xuất giỏ hàng." });
        }
    },
    
    // hiển thị thông tin chi tiết giỏ hàng xem trang riêng
    getChiTietCart_XemCT: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = "shoplist"

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }
       
        const customerAccountId = req.session.userId;
        console.log("customerAccountId:", customerAccountId);
        let detailCart = await Cart.findOne({MaTKKH: customerAccountId}).exec();
        let productDetailsArray = []
        let cartItemss = detailCart.cart 

        let totalCartPrice = 0;
        // Tính tổng giá của tất cả sản phẩm trong giỏ hàng
        for (const item of cartItemss.items) {
            //const productDetails = await SanPham.findById(item.productId).exec();
            totalCartPrice += item.donGia * item.qty;
        }

        let giam_Gia = 0
        if(totalCartPrice <= 500000) {
            giam_Gia = totalCartPrice * 0.02 // giam 2% tong so tien
        } else if (500000 < totalCartPrice && totalCartPrice <= 1000000) {
            giam_Gia = totalCartPrice * 0.03 // giam 3% tong so tien
        } else if (1000000 < totalCartPrice && totalCartPrice <= 10000000) {
            giam_Gia = totalCartPrice * 0.04 // giam 4% tong so tien
        } else {
            giam_Gia = totalCartPrice * 0.05 // giam 5% tong so tien
        }
        console.log("giamgia chi tiet: ", giam_Gia);

        if (detailCart) {
            const cartItems = detailCart.cart.items;
            
            for (const item of cartItems) {

                // console.log(`item._id cần xóa: ${item._id}`);   // xem id can xoa

                try {
                    const productDetails = await SanPham.findById(item.productId).populate('IdLoaiSP').exec();

                    if (productDetails) {
                        const tensp = productDetails.TenSP;
                        const qty = item.qty;
                        const size = item.size;
                        const donGia = item.donGia;
                        const giaBan = productDetails.GiaBan;

                        // Đẩy chi tiết sản phẩm vào mảng
                        productDetailsArray.push({
                            productDetails, 
                            qty, size, donGia,
                            _id: item._id
                        });
                    } else {
                        console.log("Không tìm thấy chi tiết sản phẩm cho mặt hàng:", item.productId);
                    }
                } catch (error) {
                    console.error("Lỗi khi truy xuất chi tiết sản phẩm:", error);
                }
            }
        } else {
            console.log("Giỏ hàng trống");
        }  

        res.render("TrangChu/layouts/ChiTietCart/chiTietCart.ejs", {
            formatCurrency: formatCurrency, active,
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,            
            hoten, logIn,
            productDetailsArray,
            cartItemss, detailCart,
            totalCartPrice, // Truyền tổng giá của tất cả sản phẩm xuống EJS
            giam_Gia
        })
    }
}