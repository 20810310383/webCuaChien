const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
require('rootpath')();
const moment = require('moment-timezone');
// --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY ');
}

module.exports = {

    // phân trang ...
    getHomePhanTrang_SearchTKAdmin: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/page-search-tkadmin?search_ben_admin=${req.query.search_ben_admin}&page=${req.query.page}`)
        }
        res.redirect(`/page-search-tkadmin`)
    },

    getSearchTKAdmin: async (req, res) => {

        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'

        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        let tenSPSearch = req.query.search_ben_admin
        // Lưu trữ giá trị tìm kiếm trong session hoặc cookie
        req.session.tenSPSearch = tenSPSearch;

        const timKiemTaiKhoanKH = await TaiKhoan_Admin.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') }, }).skip(skip).limit(limit).exec();

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKKHWithVietnamTime = timKiemTaiKhoanKH.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        if (!timKiemTaiKhoanKH) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy tài khoản.");
        }

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_Admin.find({ TenDangNhap: { $regex: new RegExp(tenSPSearch, 'i') }, })).length) / limit

        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1 

        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdmin/searchTKAdmin.ejs", {
            tk, logged, activee,
            soTrang: numPage, 
            curPage: page, 
            QLtaikhoan_kh: allTKKHWithVietnamTime,
            searchSPSession: req.session.tenSPSearch || '',
        })
    },
}   