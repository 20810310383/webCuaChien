const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const LoaiSP = require("../../models/LoaiSP");
require("rootpath")();

// --------------------------------------

module.exports = {
  // xóa 1 sản phẩm trong giỏ hàng
  removeACTCart: async (req, res) => {
    try {
      let idRemove = req.params.idARemove;
      // let idRemove = req.body.idARemove;
      console.log("idRemove: ", idRemove);

      const removedProduct = await Cart.findOneAndUpdate(
        { "cart.items._id": idRemove },
        { $pull: { "cart.items": { _id: idRemove } } },
        { new: true } // Trả lại tài liệu đã cập nhật
      );

      // Kiểm tra xem sản phẩm đã được tìm thấy và xóa chưa
      if (removedProduct && removedProduct.cart && removedProduct.cart.items) {
        let totalQuaty = 0;
        // Tính tổng giá và tổng số lượng cập nhật dựa trên các mặt hàng còn lại
        for (const item of removedProduct.cart.items) {
          try {
            let productDetails = await SanPham.findById(item.productId).exec();
            if (productDetails) {
              const giaBan = Number(productDetails.GiaBan);
              // console.log("giaBan --->>>>", giaBan);

              totalQuaty += item.qty;
            }
          } catch (error) {
            console.error("Lỗi tính toán itemTotal:", error);
          }
        }

        // Cập nhật tổng giá và tổng số lượng trong Giỏ hàng
        await Cart.findByIdAndUpdate(
          { _id: removedProduct._id },
          { $set: { "cart.totalQuaty": totalQuaty } }
        );        

        return res.status(200).json({ success: true, message: 'Đã sản phẩm khỏi giỏ hàng thành công'});
        // res.redirect("/detailt-cart-trang-moi");
      } else {
        return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm để xóa.' });
        // res.status(404).send("Không tìm thấy sản phẩm để xóa.");
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};
