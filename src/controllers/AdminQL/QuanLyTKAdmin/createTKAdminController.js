const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")

// --------------------------------------------

module.exports = {

    // get trang nhập liệu create admin
    getCreateTKAdmin: async (req, res) =>{
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'      

        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdmin/createTKAdmin.ejs", {
            tk, logged, activee
        })  
    },

    // xử lý nút tạo tài khoản 
    createTKAdmin: async (req, res) => {
        
        let TenDangNhap = req.body.TenDangNhap
        let HoTen = req.body.HoTen
        let MatKhau = req.body.MatKhau

        // Kiểm tra xem có tài khoản nào khác có cùng 'TenDangNhap' không
        let existingAdmin = await TaiKhoan_Admin.findOne({ TenDangNhap: TenDangNhap });

        if (existingAdmin) {
            // Trả về mã lỗi 409 nếu 'TenDangNhap' đã tồn tại
            return res.status(409).json({
                message: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!",
                success: false,
                KQ: 1
            });
        }

        let createAdmin = await TaiKhoan_Admin.create({
            TenDangNhap: TenDangNhap,
            HoTen: HoTen,
            MatKhau: MatKhau
        })
        
        if(createAdmin){
            console.log("createAdmin: ", createAdmin);
            return res.status(200).json({
                message: "Bạn đã tạo tài khoản admin thành công!",
                success: true,
                KQ: 0,
                data: createAdmin
            })
        } else {
            return res.status(500).json({
                message: "Tạo tài khoản thất bại! Vui lòng thử lại",
                success: false,   
                KQ: -1             
            })
        }        
    }
}