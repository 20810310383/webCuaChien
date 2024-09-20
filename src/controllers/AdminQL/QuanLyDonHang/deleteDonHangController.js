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

    DeleteDH: async (req, res) => {
        try{
            let idXoaDH = req.params.idXoaDH

            let deleteDH = await HoaDon.findByIdAndDelete(idXoaDH)

            if (deleteDH) {
                res.status(200).json({success: true, message: 'Xóa đơn hàng thành công.' });

            } else {
                res.status(404).json({success: false, message: 'Xóa Thất bại.' });
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

}