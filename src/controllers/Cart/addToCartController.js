const SanPham = require("../../models/SanPham")
const Cart = require("../../models/Cart")
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')();

// --------------------------------------

module.exports = {
    addToCart: async (req, res) => {
        try {
            let logged = req.session.loggedIn
            let hoten = req.session.hoten
            const productId = req.query.productId;
            const size = req.body.size;
            const PriceBanMoi = req.body.PriceBanMoi;
            const SoLuongTon = req.body.SoLuongTon;
            const qtyy = parseInt(req.body.quantity);
            const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
    
            // Lấy thông tin đăng nhập của khách hàng từ request
            const customerAccountId = req.session.userId;
            // console.log(">>> check id customerAccountId: ", customerAccountId);
            
            // console.log(">>> check so luong: ", qty);
            // console.log(">>> check PriceBanMoi: ", PriceBanMoi);
            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await SanPham.findById(productId);
            if (!product) {
                return res.status(404).json({success: false, message: 'Sản phẩm không tồn tại' });
            }

            let mess = `Số lượng tồn của sản phẩm này chỉ còn ${SoLuongTon} sản phẩm. Vui lòng chọn số lượng hoặc sản phẩm khác!`
            if(qty > SoLuongTon){
                return res.status(404).json({success: false, message: mess, logged, hoten });
            }
            // Giảm số lượng tồn của sản phẩm chỉ khi số lượng tồn đủ để thêm vào giỏ hàng
            // if (qty <= SoLuongTon) {
            //     product.SoLuongTon -= qtyy;
            //     await product.save();
            // } else {
            //     return res.status(404).json({ success: false, message: mess, logged });
            // }

    
            // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
            let cart;

            // Nếu đăng nhập, sử dụng MaTKKH để liên kết với người dùng
            if (customerAccountId) {
                cart = await Cart.findOne({ MaTKKH: customerAccountId });
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            // totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: customerAccountId,
                    });
                }
            } else {
                // Nếu không đăng nhập, kiểm tra xem có giỏ hàng trong session hay không
                if (req.session.cartId) {
                    // Nếu có giỏ hàng, lấy giỏ hàng từ cơ sở dữ liệu
                    cart = await Cart.findById(req.session.cartId);
                }
    
                // Nếu không có giỏ hàng trong session hoặc database, tạo giỏ hàng mới
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            // totalPrice: 0,
                            totalQuaty: 0,                            
                        },
                        MaTKKH: null,
                    });
                }
            }

            // // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            // const existingItem = cart.cart.items.find((item) => item.productId.equals(productId));

            
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng với kích thước đã cho chưa
            let existingItem;
            for (const item of cart.cart.items) {
                if (item.productId.equals(productId) && item.size === size) {
                    existingItem = item;
                    break;
                }
            }
    
            if (existingItem) {
                // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
                existingItem.qty += qty;
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.cart.items.push({
                    productId: product._id,
                    qty: qty,
                    donGia: PriceBanMoi,
                    size: size
                });
            }
    
            // // Cập nhật tổng số lượng và tổng tiền
            // cart.cart.totalQuaty += qty;
            // cart.cart.totalPrice += product.GiaBan * qty;

            // Cập nhật tổng số lượng và tổng tiền
            cart.cart.totalQuaty = cart.cart.items.reduce((total, item) => total + item.qty, 0);
            // cart.cart.totalPrice = cart.cart.items.reduce((total, item) => total + (item.qty * product.GiaBan), 0);
    
            //console.log("so luong tong: ", cart.cart.totalQuaty);
            // console.log("gia: ", cart.cart.totalPrice);
            // Lưu cart vào session nếu user không đăng nhập
            if (!customerAccountId) {
                req.session.cart = cart;
            }

            // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
            if (customerAccountId) {                
                await cart.save();
            }    

            return res.status(200).json({ success: true, message: 'Đã thêm sản phẩm vào giỏ hàng', logged, hoten });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },  
}
