const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")

// --------------------------------------------

module.exports = {
    // xóa tài khoản Admin
    deleteTKAdmin: async (req, res) => {
        let idXoa = req.params.idxoa
        console.log("idXoa: ", idXoa)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaAdmin = await TaiKhoan_Admin.delete({_id: idXoa})

        return res.status(200).json({
            message: "Bạn đã khóa tài admin hàng thành công!",
            success: true,
            KQ: 0,
            data: xoaAdmin
        })
    }
}