const express = require('express');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart();
const fs = require('fs').promises;

const { getHomeHienThi1 } = require("../controllers/TrangChu/homeController");
const { getFormLoginKH, dangKyTKKH, dangNhapTKKH, dangXuatTKKH } = require('../controllers/Login/loginKHController');
const { chiTietSPHomeHienThi1, chiTietSPHomeHienThi1_ChiTiet } = require('../controllers/CTSanPham/detailtSP');
const { getHomeListShop, getHomeListShop_PhanTrang, getHomeListShop_TheoLoai_PhanTrang } = require('../controllers/ShopList/listShopController');
const { searchNH_PhanTrang, searchNH, searchNH_PhanLoai_PhanTrang } = require('../controllers/SearchSP/searchNHController');
const { getHomeListShopPhanLoaiNam, getHomeListShopPhanLoaiNam_PhanTrang, getHomeListShopPhanLoaiNu, getHomeListShopPhanLoaiNu_PhanTrang } = require('../controllers/PhanLoaiSP/phanLoaiNuocHoaController');
const { addToCart } = require('../controllers/Cart/addToCartController');
const { getCartInfo } = require('../controllers/Cart/getCartInfoController');
const {getChiTietCart, getChiTietCart_XemCT} = require('../controllers/Cart/getChiTietCartController');
const { removeACTCart } = require('../controllers/Cart/remove_Mot_SPCartController');
const { getCheckOut, datHang } = require('../controllers/Cart/datHangController');
const { getEditAProductCart, updateAProductCart } = require('../controllers/Cart/edit_Mot_SPCartController');
const { home_LichSuMuaHang } = require('../controllers/LichSuMuaHang/home_LichSuMuaHangController');
const { getLoginAdmin, dangNhapAdmin } = require('../controllers/Login/loginAdminController');
const { getHomePageAdmin } = require('../controllers/AdminQL/HomeAdmin/homeAdminController');
const { getHomeQLKH, getHomePhanTrang_TKKH } = require('../controllers/AdminQL/QuanLyTK/quanLyTKKHController');
const { getHomePhanTrang_SearchTKKH, getSearchTKKH } = require('../controllers/AdminQL/QuanLyTK/searchTKKHController');
const { deleteTKKH } = require('../controllers/AdminQL/QuanLyTK/deleteTKKHController');
const { getEditTKKH, editTKKH } = require('../controllers/AdminQL/QuanLyTK/editTKKHController');
const { getHomeQLAdmin, getHomePhanTrang_TKAdmin } = require('../controllers/AdminQL/QuanLyTKAdmin/quanLyTKAdminController');
const { getEditTKAdmin, editTKAdmin } = require('../controllers/AdminQL/QuanLyTKAdmin/editTKAdminController');
const { deleteTKAdmin } = require('../controllers/AdminQL/QuanLyTKAdmin/deleteTKAdminController');
const { getCreateTKAdmin, createTKAdmin } = require('../controllers/AdminQL/QuanLyTKAdmin/createTKAdminController');
const { getHomePhanTrang_SearchTKAdmin, getSearchTKAdmin } = require('../controllers/AdminQL/QuanLyTKAdmin/searchTKAdminController');
const { getHomeNuocHoa, getHomeNuocHoaPhanTrang } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/homeQLNuocHoa');
const { getCreateNuocHoa, createNuocHoa } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/createSPNuocHoa');
const { getEditNuocHoa, handleEditNuocHoa, getEditNuocHoaDaXoa, handleEditNuocHoaDaXoa } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/editSPNuocHoa');
const { deleteSP } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/deleteSPNuocHoa');
const { getHomeSearchNuocHoa, getHomeSearchNuocHoaPhanTrang, getHomeSearchNuocHoaDaXoaPhanTrang, getHomeSearchNuocHoaDaXoa } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/searchSPNuocHoa');
const { getHomeDaXoaNuocHoaPhanTrang, getHomeDaXoaNuocHoa } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/daXoaSPNuocHoa');
const { getHomeQLAdminPhanQuyen, getHomePhanTrang_TKAdminPhanQuyen } = require('../controllers/AdminQL/QuanLyTKAdmin_PhanQuyen/quanLyTKAdminPhanQuyenController');
const { getCreateTKAdminPhanQuyen, createTKAdminPhanQuyen } = require('../controllers/AdminQL/QuanLyTKAdmin_PhanQuyen/createTKAdminPhanQuyenController');
const { deleteTKPhanQuyen } = require('../controllers/AdminQL/QuanLyTKAdmin_PhanQuyen/deleteTKAdminPhanQuyenController');
const { getTrangQLDonHang, getTrangQLDonHang_ChuaGiao_PhanTrang} = require('../controllers/AdminQL/QuanLyDonHang/quanLyDonHangController');
const { getEditDH, putUpdate_QLDH } = require('../controllers/AdminQL/QuanLyDonHang/editDonHangController');
const { DeleteDH } = require('../controllers/AdminQL/QuanLyDonHang/deleteDonHangController');
const { contactUs } = require('../controllers/ContactUs/contactUsController');
const { huyDonHang } = require('../controllers/LichSuMuaHang/huyDonHangController');
const { quenMatKhauKH, doiMatKhauKH } = require('../controllers/Login/quenMatKhauKHController');
const { trangLoaiSP, deleteLoaiSP, suaLoaiSP, themLoaiSP } = require('../controllers/AdminQL/QuanLySanPham/QuanLySPNuocHoa/quanLyLoaiSP');

const passport = require('passport');
const router = express.Router();
//  ********************************************************

// TRANG CHU
router.get("/", getHomeHienThi1)


// LOGIN Tai Khoan Khach Hang
router.get("/login-tk-kh", getFormLoginKH)
// Dang Ky Tai Khoan Khach Hang
router.post("/dang-ky-tkkh", dangKyTKKH)
// Dang Nhap Tai Khoan Khach Hang
router.post("/dang-nhap-tkkh", dangNhapTKKH)
// Dang Xuat Tai Khoan Khach Hang
router.get("/dang-xuat-tkkh", dangXuatTKKH)
// quên mật khẩu
router.post("/quen-mat-khau", quenMatKhauKH)
router.post("/doi-mat-khau-kh", doiMatKhauKH)


// Chi Tiet San Pham
router.post("/detailt-sp", chiTietSPHomeHienThi1)
router.get("/detailt-sp-ht1", chiTietSPHomeHienThi1_ChiTiet)



// list shop
// SHOP Nuoc Hoa
router.get("/shop-list-ht1", getHomeListShop)
// router.post("/shop-list-ht1", getHomeListShop)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
// router.get("/shop-list-ht1", getHomeListShop_PhanTrang)
router.get("/shop-list-ht1", async (req, res) => {
    if (!req.query.idPL) {
        return getHomeListShop_PhanTrang(req, res);

    } else if (req.query.idPL) {
        return getHomeListShop_TheoLoai_PhanTrang(req, res);
        
    } else {
        res.redirect(`/shop-list-ht1`);
    }
});


// Search SanPham
router.get("/search-nuoc-hoa", searchNH)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-nuoc-hoa", async (req, res) => {
    if (req.query.search_nuochoa) {
        return searchNH_PhanTrang(req, res);

    } else if (req.query.tenloaiNH && req.query.giaSP) {
        return searchNH_PhanLoai_PhanTrang(req, res);
        
    } else {
        res.redirect(`/search-nuoc-hoa`);
    }
});



// Phan Loai San Pham 
// SHOP Nuoc Hoa
// phan loai nam
router.get("/shop-list-phan-loai-nuoc-hoa-nam", getHomeListShopPhanLoaiNam)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/shop-list-phan-loai-nuoc-hoa-nam", getHomeListShopPhanLoaiNam_PhanTrang)
// phan loai nu
router.get("/shop-list-phan-loai-nuoc-hoa-nu", getHomeListShopPhanLoaiNu)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/shop-list-phan-loai-nuoc-hoa-nu", getHomeListShopPhanLoaiNu_PhanTrang)



// Cart Products
// Add to Cart
router.post("/addtocart", addToCart)
// get info cart
router.get("/get-info-cart", getCartInfo)
// get chi tiet cart tại trang
router.get("/get-chi-tiet-cart", getChiTietCart)
// get trang xem chi tiết giỏ hàng
router.get("/detailt-cart-trang-moi", getChiTietCart_XemCT)
// xóa 1 sản phẩm trong cart
router.post("/remove-mot-sp/:idARemove", removeACTCart)
// trang dien thong tin dat hang va check don hang
router.get("/checkout", getCheckOut)
// get Edit A Product Cart
router.get("/get-edit-sp-cart", getEditAProductCart)
// xử lý nút update 
router.put("/update-sp-cart/:idupdateCart", updateAProductCart)
// xử lý nút bấm đặt hàng
router.post("/dat-hang", datHang)



// contact us
router.get("/contact", contactUs)



// Lịch sử mua hàng
router.get("/lsu-mua-hang", home_LichSuMuaHang)
router.delete("/huy-don-hang/:huydonhang", huyDonHang)


//**********************************************************************

// VỀ PHẦN ADMIN QUẢN LÝ 
// get login admin
router.get("/login-admin", getLoginAdmin)
// btn đăng nhập
router.post("/login-admin", dangNhapAdmin)
// get gome page admin
router.get("/home-page-admin", getHomePageAdmin)



// get home quản lý tài khoản khách hàng
router.get("/page-qly-tkkh", getHomeQLKH)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/page-qly-tkkh", getHomePhanTrang_TKKH)
// get home tìm kiếm tài khoản khách hàng
router.get("/page-search-tkkh", getSearchTKKH)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/page-search-tkkh", getHomePhanTrang_SearchTKKH)
// xóa tài khoản khách hàng
router.delete("/xoatkkh/:idxoa", deleteTKKH)
// get trang nhập liệu edit
router.get("/get-page-edit", getEditTKKH)
// xử lý nút save tài khoản khách hàng
router.put("/update-tk-kh/:idDeEdit", editTKKH)



// get home quản lý tài khoản admin
router.get("/page-qly-tkadmin", getHomeQLAdmin)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/page-qly-tkadmin", getHomePhanTrang_TKAdmin)
// get trang nhập liệu edit
router.get("/get-page-tk-admin-edit", getEditTKAdmin)
// xử lý nút save tài khoản admin
router.put("/update-tk-admin/:idDeEdit", editTKAdmin)
// xóa tài khoản admin
router.delete("/xoatkAdmin/:idxoa", deleteTKAdmin)
// get trang nhập liệu create
router.get("/create-admin", getCreateTKAdmin)
// xử lý nút create tài khoản admin
router.post("/create-tk-admin", createTKAdmin)
// get home tìm kiếm tài khoản admin
router.get("/page-search-tkadmin", getSearchTKAdmin)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/page-search-tkadmin", getHomePhanTrang_SearchTKAdmin)

// get home quản lý tài khoản admin phân quyền
router.get("/page-qly-tkadmin-phan-quyen", getHomeQLAdminPhanQuyen)
// router.get("/page-qly-tkadmin-phan-quyen", getHomePhanTrang_TKAdminPhanQuyen)
// get trang nhập liệu create
router.get("/create-admin-phan-quyen", getCreateTKAdminPhanQuyen)
// xử lý nút create admin phân quyền
router.post("/create-admin-phan-quyen", createTKAdminPhanQuyen)
// xóa tài khoản phân quyền
router.delete("/xoatk-phan-quyen/:idxoa", deleteTKPhanQuyen)





// get home quản lý sản phẩm là nước hoa
router.get("/page-qly-nuoc-hoa", getHomeNuocHoa)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/page-qly-nuoc-hoa", getHomeNuocHoaPhanTrang)
// get trang nhập liệu create
router.get("/create-sp-nuochoa", getCreateNuocHoa)
// xử lý nút create sản phẩm nước hoa
router.post("/create-sp-nuochoa", createNuocHoa)
// get trang nhập liệu edit
router.get("/edit-sp-nuochoa", getEditNuocHoa)
// xử lý nút save sản phẩm nước hoa
router.put("/save-sp-nuochoa/:idEdit", handleEditNuocHoa)
// xóa sản phẩm nước hoa
router.delete("/xoa-sp-nuoc-hoa/:idxoa", deleteSP)
// get home tìm kiếm sản phẩm nước hoa
router.get("/search-qly-nuoc-hoa", getHomeSearchNuocHoa)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-qly-nuoc-hoa", getHomeSearchNuocHoaPhanTrang)


// upload hình ảnh trong phần thêm/chỉnh sửa sản phẩm phía admin textarea
const path = require('path');



async function uploadSingleFile(file) {
    // Implement the logic to upload the file here
    // Example logic for uploading the file to a specific directory:
    const uploadPath = path.resolve(__dirname, "../public/images/upload/");
    const fileName = file.name;
    const filePath = `${uploadPath}/${fileName}`;
    await fs.writeFile(filePath, file.data);
    
    // Return the result of the upload operation
    return {
        status: "thanh cong",
        path: filePath,
        error: null
    };
}
router.post('/upload', async (req, res) => {
    try {
        const file = req.files.upload;
        const result = await uploadSingleFile(file);

        if (result.status === "thanh cong") {
            const fileName = path.basename(result.path);
            const url = `/images/upload/${fileName}`;
            const msg = 'Upload thành công!';
            const funcNum = req.query.CKEditorFuncNum;
            console.log({ url, msg, funcNum });
            res.status(201).send(`<script>window.parent.CKEDITOR.tools.callFunction('${funcNum}','${url}','${msg}');</script>`);
        } else {
            console.error("File upload failed:", result.error);
            res.status(500).send('Internal server error');
        }
    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).send('Internal server error');
    }
});

// test upload video
// const path = require('path');

// // Hàm xử lý tải lên hình ảnh
// async function uploadImage(file) {
//     const uploadPath = path.resolve(__dirname, "../public/images/upload/");
//     const fileName = file.name;
//     const filePath = `${uploadPath}/${fileName}`;
//     await fs.writeFile(filePath, file.data);
    
//     return {
//         status: "thanh cong",
//         path: filePath,
//         error: null
//     };
// }

// // Hàm xử lý tải lên video
// async function uploadVideo(file) {
//     const uploadPath = path.resolve(__dirname, "../public/videos/upload/");
//     const fileName = file.name;
//     const filePath = `${uploadPath}/${fileName}`;
//     await fs.writeFile(filePath, file.data);
    
//     return {
//         status: "thanh cong",
//         path: filePath,
//         error: null
//     };
// }

// router.post('/upload', async (req, res) => {
//     try {
//         const file = req.files.upload;
//         const mimeType = file.mimetype;
        
//         // Nếu là hình ảnh
//         if (mimeType.startsWith('image')) {
//             const result = await uploadImage(file);
//             // Xử lý kết quả và trả về
//             if (result.status === "thanh cong") {
//                 const fileName = path.basename(result.path);
//                 const url = `/images/upload/${fileName}`;
//                 const msg = 'Upload thành công!';
//                 const funcNum = req.query.CKEditorFuncNum;
//                 console.log({ url, msg, funcNum });
//                 res.status(201).send(`<script>window.parent.CKEDITOR.tools.callFunction('${funcNum}','${url}','${msg}');</script>`);
//             } else {
//                 console.error("File upload failed:", result.error);
//                 res.status(500).send('Internal server error');
//             }
//         } 
//         // Nếu là video
//         else if (mimeType.startsWith('video')) {
//             const result = await uploadVideo(file);
//             // Xử lý kết quả và trả về
//             if (result.status === "thanh cong") {
//                 const fileName = path.basename(result.path);
//                 const url = `/videos/upload/${fileName}`;
//                 const msg = 'Upload thành công!';
//                 const funcNum = req.query.CKEditorFuncNum;
//                 console.log({ url, msg, funcNum });
//                 res.status(201).send(`<script>window.parent.CKEDITOR.tools.callFunction('${funcNum}','${url}','${msg}');</script>`);
//             } else {
//                 console.error("File upload failed:", result.error);
//                 res.status(500).send('Internal server error');
//             }
//         }
//         // Nếu không phải hình ảnh hoặc video
//         else {
//             throw new Error('File không hợp lệ');
//         }
//     } catch (error) {
//         console.error("Error uploading file:", error.message);
//         res.status(500).send('Internal server error');
//     }
// });
// end test upload video



// -----------------------------------------------------------
// hiển thị trang quản lý loại sản phẩm
router.get("/trang-quan-ly-loaisp", trangLoaiSP)
// xoá loại sản phẩm
router.delete("/xoa-loaisp-nuoc-hoa/:idxoaLoaiSP", deleteLoaiSP)
// sửa loại sản phẩm
router.post("/sua-loaisp-nuoc-hoa/:idsualoai", suaLoaiSP)
// thêm loại sản phẩm
router.post("/them-loaisp-nuoc-hoa", themLoaiSP)



// get home sản phẩm nước hoa đã xóa
router.get("/da-xoa-sp-nuochoa", getHomeDaXoaNuocHoa)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/da-xoa-sp-nuochoa", getHomeDaXoaNuocHoaPhanTrang)
// get trang nhập liệu edit đã xóa
router.get("/edit-sp-nuochoa-daxoa", getEditNuocHoaDaXoa)
// xử lý nút save sản phẩm nước hoa đã xóa
router.put("/save-sp-nuochoa-da-xoa/:idEditDaXoa", handleEditNuocHoaDaXoa)
// get home tìm kiếm sản phẩm nước hoa đã xóa
router.get("/search-qly-nuoc-hoa-da-xoa", getHomeSearchNuocHoaDaXoa)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-qly-nuoc-hoa-da-xoa", getHomeSearchNuocHoaDaXoaPhanTrang)




// quản lý đơn hàng -- admin
router.get("/ql-don-hang", getTrangQLDonHang)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/ql-don-hang", getTrangQLDonHang_ChuaGiao_PhanTrang)
// get form edit đơn hàng
router.get("/update-HoaDon", getEditDH)
// update đơn hàng
router.put("/update-HoaDon/:id_QLDH", putUpdate_QLDH)
// Xóa đơn hàng Đã Giao Hàng
router.delete("/delete-HoaDon/:idXoaDH", DeleteDH)
// ----------------------------------------------------------------




module.exports = router;