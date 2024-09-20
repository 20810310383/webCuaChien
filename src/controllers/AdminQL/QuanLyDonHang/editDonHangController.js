const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
const SanPham = require("../../../models/SanPham")
const LoaiSP = require("../../../models/LoaiSP")
const HoaDon = require("../../../models/HoaDon")

const aqp = require('api-query-params')


require('rootpath')();

const moment = require('moment-timezone');
//  --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {

    getEditDH: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let activee = 'donhang'

        let idUpdate_HD = req.query.idUpdate_HD
        console.log("idUpdate_HD",idUpdate_HD);
        let getId = await HoaDon.findById({ _id: idUpdate_HD}).exec()
        console.log("getId",getId._id);

        res.render("AdminQL/TrangQLAdmin/QL_DonHang/formEditDH.ejs", {
            logged: loggedIn, 
            tk: taikhoan,
            getId, activee
        })
    },

    putUpdate_QLDH: async (req, res) => {

        try {
            let id_QLDH = req.params.id_QLDH
            let TinhTrangDonHang = req.body.TinhTrangDonHang
            let TinhTrangThanhToan = req.body.TinhTrangThanhToan


            let updateDH = await HoaDon.findByIdAndUpdate( {_id: id_QLDH}, {
                TinhTrangDonHang, TinhTrangThanhToan
            })

            console.log("chinh sua updateDH: ", updateDH);
            
            res.status(201).json({ success: true, message: 'Chỉnh sửa đơn hàng thành công' });
            // res.redirect('/ql-don-hang'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

}