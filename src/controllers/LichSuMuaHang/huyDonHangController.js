const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const HoaDon = require("../../models/HoaDon");
const HuyDonHang = require("../../models/HuyDonHang");
const LoaiSP = require("../../models/LoaiSP");
require('dotenv').config();
require('rootpath')();

// --------------------------------------

module.exports = {
    huyDonHang: async (req, res) => {

        let id_huydonhang = req.params.huydonhang
        console.log("id huy don hang: ",id_huydonhang);

        let timHDCanHuy = await HoaDon.findOne({_id: id_huydonhang})

        let luuHuyHD = await HuyDonHang.create({
            Ho: timHDCanHuy.Ho,
            Ten: timHDCanHuy.Ten,
            ThanhPho: timHDCanHuy.ThanhPho,
            QuanHuyen: timHDCanHuy.QuanHuyen,
            PhuongXa: timHDCanHuy.PhuongXa,
            DiaChiChiTiet: timHDCanHuy.DiaChiChiTiet,
            SoDienThoai: timHDCanHuy.SoDienThoai,
            Email: timHDCanHuy.Email,
            Note: timHDCanHuy.Note,
            PhiShip: timHDCanHuy.PhiShip,
            CanThanhToan: timHDCanHuy.CanThanhToan,
            GiamGia: timHDCanHuy.GiamGia,
            SoTienGiamGia: timHDCanHuy.SoTienGiamGia,
            TinhTrangDonHang: timHDCanHuy.TinhTrangDonHang,
            TinhTrangThanhToan: timHDCanHuy.TinhTrangThanhToan,
            TongSLDat: timHDCanHuy.TongSLDat,            
            MaKH: timHDCanHuy.MaKH,
            cart: timHDCanHuy.cart
        })

        if(luuHuyHD){
            await HoaDon.deleteOne({_id: id_huydonhang});
            // return res.redirect("/order-history")
            res.status(201).json({ success: true, message: 'Hủy Đơn Hàng Thành Công' });
        } else {
            res.status(500).json({ success: false, message: 'Hủy Đơn Hàng thất bại' });
        }
    }
}