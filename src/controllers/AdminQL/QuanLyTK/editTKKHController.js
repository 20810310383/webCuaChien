const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")

// --------------------------------------------

module.exports = {

    // get trang nhập liệu edit
    getEditTKKH: async (req, res) =>{
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'

        let idEdit = req.query.idEdit
        console.log("idEdit: ", idEdit);

        let tkEdit = await TaiKhoan_KH.findById(idEdit)

        if(tkEdit) {
            res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanKH/getEditTKKH.ejs", {
                tk, logged, activee, tkEdit
            })
        } else {
            return res.status(404).json({message: "Không tìm thấy account khách hàng này!"})
        }    
    },

    // xử lý nút save tài khoản khách hàng
    editTKKH: async (req, res) => {
        
        let idDeEdit = req.params.idDeEdit
        let TenDangNhap = req.body.TenDangNhap
        let HoTen = req.body.HoTen
        let MatKhau = req.body.MatKhau
        console.log("idDeEdit: ", idDeEdit);

        let updateKH = await TaiKhoan_KH.updateOne({_id: idDeEdit}, {
            TenDangNhap: TenDangNhap,
            HoTen: HoTen,
            MatKhau: MatKhau
        })
        
        if(updateKH){
            console.log("updateKH: ", updateKH);
            return res.status(200).json({
                message: "Bạn đã chỉnh sửa tài khoản khách hàng thành công!",
                success: true,
                KQ: 0,
                data: updateKH
            })
        } else {
            return res.status(204).json({
                message: "Chỉnh sửa thất bại! Vui lòng thử lại",
                success: false,                
            })
        }        
    }
}