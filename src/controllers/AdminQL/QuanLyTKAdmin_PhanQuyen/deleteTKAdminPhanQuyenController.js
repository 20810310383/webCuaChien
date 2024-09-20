const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
const PhanQuyen = require("../../../models/PhanQuyen")
const ChucNang = require("../../../models/ChucNang")
const mongoose = require('mongoose');

// --------------------------------------------

module.exports = {
    // xóa 
    deleteTKPhanQuyen: async (req, res) => {

        let idCanXoa = req.params.idxoa
        // let idCanXoa = req.body.adminId
        console.log("idCanXoa: ",idCanXoa);

        let dlt = await PhanQuyen.deleteMany({IdAdminNhanVien: idCanXoa})

        let dltString = JSON.stringify(dlt.deletedCount);
        let mess = `Bạn đã xóa ${dltString} bản ghi chức năng thành công!`

        if(dlt){
            return res.status(200).json({
                message: mess,
                success: true,
                KQ: 0,
                data: dlt
            })
        } else {
            return res.status(404).json({
                message: "Bạn đã xóa tài khoản thất bại!",
                success: false,
                KQ: -1,               
            })
        }        
    }
}