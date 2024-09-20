const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const LoaiSP = require("../../models/LoaiSP");
require("rootpath")();

// --------------------------------------

module.exports = {
    // trang dien thong tin chinh sua 1 san pham cart -> chi duoc chinh sua so luong va size
    getEditAProductCart: async (req, res) => {
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

        // rút gọn mã HD
        function rutGonMa(hexString ) {
            const shortenedHex = hexString.substring(hexString.length - 10);
            return shortenedHex;
        }


        const customerAccountId = req.session.userId;
        console.log("customerAccountId", customerAccountId);

        let getIdEdit = req.query.getIdEditSPCart
        console.log("getIdEditSPCart", getIdEdit);

        // trước tiên tìm cái giỏ hàng của thằng A trước, vì trong cart sẽ có nhiều giỏ hàng chứa SP X
        let timCart = await Cart.findOne({ MaTKKH: customerAccountId}).populate('cart.items.productId')
        console.log("timCart:", timCart.cart.items);

        // get ra sản phẩm cần tìm trong timCart theo getIdEditSPCart
        if (timCart !== null && timCart.cart && timCart.cart.items) {
            const spEdit = timCart.cart.items.find(item => item._id.toString() === getIdEdit);
            console.log("spEdit", spEdit);

            res.render("TrangChu/layouts/ChiTietCart/editAProductCart.ejs", {
                formatCurrency, active,
                rootPath: '/', 
                getRelativeImagePath, rutGonMa,        
                hoten, logIn, spEdit
            })
        } else {
            console.log("Không tìm thấy giỏ hàng hoặc sản phẩm");
        }        
    },

    // xu ly nut update 
    updateAProductCart: async (req, res) => {
        const quantityy = req.body.quantity;
        const size = req.body.size;
        const PriceBanMoi = req.body.PriceBanMoi;
        // let idupdateCart = req.body.idupdateCart        
        let idupdateCart = req.params.idupdateCart        

        const customerAccountId = req.session.userId;
        // Tìm cai gio hang dua vao MaKH trc tien
        let timCart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');

        // Tìm sản phẩm cần cập nhật trong mảng items dựa trên _id
        const updatedCartItem = timCart.cart.items.find(item => item._id.toString() === idupdateCart);

        // kiểm tra số lượng tồn
        let sp = await SanPham.findOne({ _id: updatedCartItem.productId._id });
        console.log("sp: ",sp);
        let mess = `Số lượng tồn của sản phẩm này chỉ còn ${updatedCartItem.productId.SoLuongTon} sản phẩm. Vui lòng chọn số lượng khác!`
        console.log("mess: ",mess);
        if(sp.SoLuongTon < quantityy){
            console.log(" hết hàng rồi ");
            return res.status(400).json({ success: false, message: mess });
        }


        if (updatedCartItem) {
            // Cập nhật qty
            updatedCartItem.qty = quantityy;
            updatedCartItem.size = size;
            updatedCartItem.donGia = PriceBanMoi;

            // Lưu lại dữ liệu đã chỉnh sửa
            await timCart.save();

            console.log('Số lượng sản phẩm đã được cập nhật thành công.');
            // return res.redirect('/detailt-cart-trang-moi')
            return res.status(200).json({ success: true, message: "Cập nhật thành công!" });
        } else {
            console.log('Không tìm thấy sản phẩm cần cập nhật trong giỏ hàng.');
        }
    },
};
