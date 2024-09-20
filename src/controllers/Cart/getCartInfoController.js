const SanPham = require("../../models/SanPham")
const Cart = require("../../models/Cart")
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')();

// --------------------------------------

module.exports = {
    // Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
    getCartInfo: async (req, res) => {
        try {
            const customerAccountId = req.session.userId;

            console.log("check userId get cart: ", customerAccountId);
    
            const cart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');
            const sp = await Cart.find({ MaTKKH: customerAccountId }).populate('cart.items.productId');
            console.log("check sp get cart: ", sp);
    
            if (!cart) {
                return res.status(200).json({ totalQuaty: 0, totalPrice: 0 });
            }
    
            // Tính tổng số lượng và tổng tiền
            let totalQuaty = 0;
            let totalPrice = 0;
    
            for (const item of cart.cart.items) {                
                totalQuaty += item.qty;
                //totalPrice += item.qty * item.productId.GiaBan; 
                totalPrice += item.qty * item.donGia; 
            }            
    
            // Kiểm tra điều kiện và thiết lập giá trị của PhiShip
            let phiShip = cart.cart.PhiShip;
            if (totalPrice >= 1000000) {
                phiShip = 0;
            }
            let giamGia = cart.cart.GiamGia
            if(totalPrice <= 500000) {
                giamGia = totalPrice * 0.02 // giam 2% tong so tien
            } else if (500000 < totalPrice && totalPrice <= 1000000) {
                giamGia = totalPrice * 0.03 // giam 3% tong so tien
            } else if (1000000 < totalPrice && totalPrice <= 20000000) {
                giamGia = totalPrice * 0.04 // giam 4% tong so tien
            } else {
                giamGia = totalPrice * 0.05 // giam 5% tong so tien
            }
            console.log("giamgia: ", giamGia);

            // Thêm thông tin vào đối tượng JSON
            const cartInfo = {
                totalQuaty: totalQuaty,
                totalPrice: totalPrice ,
                phiShip: phiShip,
                giamGia: giamGia,                
            };
    
            return res.status(200).json(cartInfo);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }
    
}