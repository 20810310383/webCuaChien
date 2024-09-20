const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")

// --------------------------------------------

module.exports = {
    // xóa tài khoản khách hàng
    deleteTKKH: async (req, res) => {
        let idXoa = req.params.idxoa
        console.log("idXoa: ", idXoa)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaKH = await TaiKhoan_KH.deleteOne({_id: idXoa})

        return res.status(200).json({
            message: "Bạn đã xóa tài khoản khách hàng thành công!",
            success: true,
            KQ: 0,
            data: xoaKH
        })
    }
}