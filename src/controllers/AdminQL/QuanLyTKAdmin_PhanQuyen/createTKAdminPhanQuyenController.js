const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
const PhanQuyen = require("../../../models/PhanQuyen")
const ChucNang = require("../../../models/ChucNang")
const mongoose = require('mongoose');

// --------------------------------------------

module.exports = {

    // get trang nhập liệu create admin
    getCreateTKAdminPhanQuyen: async (req, res) =>{
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'   
        
        let taiKhoan = await TaiKhoan_Admin.find({deleted: false})
        let chucNang = await ChucNang.find({})

        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdminPhanQuyen/createTKAdminPhanQuyen.ejs", {
            tk, logged, activee, taiKhoan, chucNang
        })  
    },

    // xử lý nút tạo tài khoản 
    createTKAdminPhanQuyen: async (req, res) => {

        let TenDangNhap = req.body.TenDangNhap;
        let ChucNang = req.body.ChucNang;
        let GhiChu = req.body.GhiChu;

        console.log("Ten: ", TenDangNhap, "\n Chuc Nang: ", ChucNang, "\n GhiChu: ", GhiChu);

        // Kiểm tra xem có tài khoản nào khác có cùng 'TenDangNhap' không
        let existingAdmin = await PhanQuyen.findOne({ IdAdminNhanVien: TenDangNhap });

        if (existingAdmin) {
            // Trả về mã lỗi 409 nếu 'TenDangNhap' đã tồn tại
            return res.status(409).json({
                message: "Tên đăng nhập đã tồn tại. Vui lòng chọn nhân viên khác hoặc chọn nhân viên để chỉnh sửa lại!",
                success: false,
                KQ: 1
            });
        }
        // Chuyển đổi mảng chuỗi ID thành mảng ObjectId
        // const chucNangIds = ChucNang.map(chucNangId => chucNangId)
        // console.log("chucNangIds: ",chucNangIds);

        // Tạo đối tượng PhanQuyen
        const phanQuyenDocs = ChucNang.map(chucNangId => ({
            IdAdminNhanVien: TenDangNhap,
            IdChucNang: chucNangId,
            GhiChu: GhiChu
        }));

        try {
            // Chèn nhiều đối tượng vào cơ sở dữ liệu
            let result = await PhanQuyen.insertMany(phanQuyenDocs);
            console.log("Inserted documents: ", result);

            if(result){
                console.log("result: ", result);
                return res.status(200).json({
                    message: "Bạn đã phân quyền thành công!",
                    success: true,
                    KQ: 0,
                    data: result
                })
            } else {
                return res.status(500).json({
                    message: "Phân quyền tài khoản thất bại! Vui lòng thử lại",
                    success: false,   
                    KQ: -1             
                })
            }  

        } catch (error) {
            console.error("Error occurred while inserting documents: ", error);
        }

    }
}