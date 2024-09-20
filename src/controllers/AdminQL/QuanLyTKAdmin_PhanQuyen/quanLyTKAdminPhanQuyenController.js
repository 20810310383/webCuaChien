const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")
const PhanQuyen = require("../../../models/PhanQuyen")
const ChucNang = require("../../../models/ChucNang")
require('rootpath')();
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

    // phân trang ... (hiện tại không cần)
    getHomePhanTrang_TKAdminPhanQuyen: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/page-qly-tkadmin-phan-quyen?page=${req.query.page}`)
        }
        res.redirect(`/page-qly-tkadmin-phan-quyen`)
    },

    getHomeQLAdminPhanQuyen: async (req, res) => {

        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'        

        // let page = 1
        // const limit = 6
        
        // if(req.query.page){
        //     page = req.query.page
        //     page = page < 1 ? page + 1 : page
        // }        
        // let skip = (page - 1) * limit

        // phân quyền 
        if(await KiemTraChucNang(req, '65eb06c95d2a4f66ed3852e4') === false){

            // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
            return res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/error404_KhongCoQuyen.ejs", {
                tk, logged, activee,                                       
            })
        }
        
        const allPhanQuyen  = await PhanQuyen.find({}).populate('IdAdminNhanVien').populate('IdChucNang').exec()
        console.log("tai khoan admin: ", allPhanQuyen )

        // Tạo một đối tượng để lưu trữ thông tin của mỗi nhân viên
        let employees = {}

        // Lặp qua tất cả các phân quyền
        allPhanQuyen.forEach((phanQuyen) => {
            const { IdAdminNhanVien, IdChucNang } = phanQuyen

            // Kiểm tra xem nhân viên đã được thêm vào danh sách hay chưa
            if (!employees[IdAdminNhanVien._id]) {
                employees[IdAdminNhanVien._id] = {
                    _idAdminNV: IdAdminNhanVien._id,
                    TenDangNhap: IdAdminNhanVien.TenDangNhap,
                    MatKhau: IdAdminNhanVien.MatKhau,
                    HoTen: IdAdminNhanVien.HoTen,
                    GhiChu: phanQuyen.GhiChu,
                    deleted: IdAdminNhanVien.deleted,
                    TenChucNang: [] // Mảng để lưu trữ các chức năng của nhân viên
                };
            }

            // Thêm chức năng vào mảng chức năng của nhân viên
            employees[IdAdminNhanVien._id].TenChucNang.push(IdChucNang.TenChucNang)
        });

        // Chuyển đổi đối tượng thành mảng để dễ dàng lặp qua trong EJS
        const employeesArray = Object.values(employees)

        console.log("employeesArray: ",employeesArray);
       

        // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        // let numPage = parseInt((await PhanQuyen.find({}).populate('IdAdminNhanVien').populate('IdChucNang')).length) / limit

        // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        // numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1   

        // res.json({data: allPhanQuyen })
        res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdminPhanQuyen/quanLyTKAdminPhanQuyen.ejs", {
            tk, logged, activee,
            // soTrang: numPage, 
            // curPage: page, 
            QLtaikhoan_kh: employeesArray ,
            searchSPSession: req.session.tenSPSearch || '',
        })
    },

}   