const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
const PhanQuyen = require("../../../models/PhanQuyen")
const ChucNang = require("../../../models/ChucNang")
const mongoose = require('mongoose');

// --------------------------------------------

module.exports = {
    // get trang nhập liệu edit admin
    getEditTKAdminPhanQuyen: async (req, res) =>{
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'   
        
        let taiKhoan = await TaiKhoan_Admin.find({deleted: false})
        let chucNang = await ChucNang.find({})

        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdminPhanQuyen/editTKAdminPhanQuyen.ejs", {
            tk, logged, activee, taiKhoan, chucNang
        })  
    },
}