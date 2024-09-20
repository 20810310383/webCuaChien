const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
require('rootpath')();
const PhanQuyen = require("../../../models/PhanQuyen")
const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
const ChucNang = require("../../../models/ChucNang")
const moment = require('moment-timezone');
// --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY ');
}
async function KiemTraChucNang(req, idChucNang){
    let nvSession = req.session.user
    console.log("req.session.user: ",req.session.user);

    let count = await PhanQuyen.findOne({
        IdAdminNhanVien: nvSession._id,
        IdChucNang: idChucNang
    });
    console.log("count: ", count);

    if(count){
        console.log("thanh true ");
        return true
    }else {
        console.log("thanh false ");
        return false
    }
}

module.exports = {

    // phân trang ...
    getHomePhanTrang_TKKH: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/page-qly-tkkh?page=${req.query.page}`)
        }
        res.redirect(`/page-qly-tkkh`)
    },

    getHomeQLKH: async (req, res) => {

        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'

        // phân quyền 
        if(await KiemTraChucNang(req, '65eb06c95d2a4f66ed3852e4') === false){

            // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
            return res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/error404_KhongCoQuyen.ejs", {
                tk, logged, activee,                          
            })
        }

        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const allTKKH = await TaiKhoan_KH.find({deleted: false}).skip(skip).limit(limit).exec()

        // Chuyển đổi ngày giờ tạo tài khoản admin sang múi giờ Việt Nam
        const allTKKhachHangnWithVietnamTime = allTKKH.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await TaiKhoan_KH.find({deleted: false})).length) / limit

        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1   

        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanKH/quanLyTKKH.ejs", {
            tk, logged, activee,
            soTrang: numPage, 
            curPage: page, 
            QLtaikhoan_kh: allTKKhachHangnWithVietnamTime,
        })
    },
}   