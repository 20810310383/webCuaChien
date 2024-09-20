const SanPham = require("../../../../models/SanPham")

require('rootpath')();
// --------------------------------------------

module.exports = {
    // xóa sản phẩm
    deleteSP: async (req, res) => {
        let idXoa = req.params.idxoa
        console.log("idXoa: ", idXoa)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaSP = await SanPham.delete({_id: idXoa})

        return res.status(200).json({
            message: "Bạn đã xóa sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaSP
        })
    }
}