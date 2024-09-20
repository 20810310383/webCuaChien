const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const HoaDon = require("../../models/HoaDon");
const HuyDonHang = require("../../models/HuyDonHang");
const LoaiSP = require("../../models/LoaiSP");
require('dotenv').config();
require('rootpath')();

// --------------------------------------

module.exports = {
    home_LichSuMuaHang: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active =''

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
        console.log("customerAccountId: ",customerAccountId);

        let soLuongDH = await HoaDon.find({MaKH: customerAccountId})
        console.log("tong hoa don: ", soLuongDH.length);
        let tongTienHD = soLuongDH.map(item => item.CanThanhToan || 0).reduce((acc, CanThanhToan) => acc + CanThanhToan, 0);
        console.log("Tổng giá của tất cả hóa đơn: ", tongTienHD);

        let all = await HoaDon.find({MaKH: customerAccountId}).populate('cart.items.productId')
        let chuaGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Chưa giao hàng'}).populate('cart.items.productId')
        let dangGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Đang giao hàng'}).populate('cart.items.productId')
        let daGiao = await HoaDon.find({MaKH: customerAccountId, TinhTrangDonHang: 'Đã giao hàng'}).populate('cart.items.productId')
        let daHuy = await HuyDonHang.find({MaKH: customerAccountId}).populate('cart.items.productId')

        res.render("KhachHang/LichSuMuaHang/trangChuLichSuMuaHang.ejs", {
            formatCurrency, 
            rootPath: '/' , 
            getRelativeImagePath, rutGonMa,
            hoten, logIn, 
            active,
            soLuongDH, tongTienHD, 
            all, chuaGiao, dangGiao, daGiao, daHuy
        })
    }
}