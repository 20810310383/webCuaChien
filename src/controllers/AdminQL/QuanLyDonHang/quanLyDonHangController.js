const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
const SanPham = require("../../../models/SanPham")
const LoaiSP = require("../../../models/LoaiSP")
const HoaDon = require("../../../models/HoaDon")
const HuyDonHang = require("../../../models/HuyDonHang")
const PhanQuyen = require("../../../models/PhanQuyen")

const aqp = require('api-query-params')


require('rootpath')();

const moment = require('moment-timezone');
//  --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
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
    getTrangQLDonHang_ChuaGiao_PhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/ql-don-hang?page=${req.query.page}`)

        } else if (req.query.page_dangGH){
            return res.redirect(`/ql-don-hang?page_dangGH=${req.query.page_dangGH}`)

        } else if (req.query.page_daGH){
            return res.redirect(`/ql-don-hang?page_daGH=${req.query.page_daGH}`)

        } else if (req.query.page_DaHuyDH){
            return res.redirect(`/ql-don-hang?page_DaHuyDH=${req.query.page_DaHuyDH}`)

        } else {
            res.redirect(`/ql-don-hang`)
        }
    },

    getTrangQLDonHang: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let activee = 'donhang'

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }

        // phân quyền 
        if(await KiemTraChucNang(req, '65fffd9aa8a948b402a806de') === false){

            // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
            return res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/error404_KhongCoQuyen.ejs", {
                tk: taikhoan, logged: loggedIn, activee,
                rootPath: '/', 
                formatCurrency, getRelativeImagePath,            
            })
        }

        // hiển thị đơn hàng khi "Chưa giao hàng"
        let page = 1
        const limit = 3        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }        
        let skip = (page - 1) * limit
        const showHDChuaGiao = await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).skip(skip).limit(limit).populate("cart.items.productId").exec()
        
        let numPage = parseInt((await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).populate("cart.items.productId")).length) / limit
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

        const showHDChuaGiaoWithVietnamTime = showHDChuaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đang giao hàng"
        let page_dangGH = 1
        const limit_dangGH = 3        
        if(req.query.page_dangGH){
            page_dangGH = req.query.page_dangGH
            page_dangGH = page_dangGH < 1 ? page_dangGH + 1 : page_dangGH
        }        
        let skip_dangGH = (page_dangGH - 1) * limit_dangGH
        const showHDDangGiao = await HoaDon.find({TinhTrangDonHang: "Đang giao hàng", deleted: false}).skip(skip_dangGH).limit(limit_dangGH).populate("cart.items.productId").exec()
        
        let numPage_dangGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đang giao hàng", deleted: false}).populate("cart.items.productId")).length) / limit_dangGH
        numPage_dangGH = numPage_dangGH - parseInt(numPage_dangGH) === 0 ? numPage_dangGH : numPage_dangGH + 1

        const showHDDangGiaoWithVietnamTime = showHDDangGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đã giao hàng"
        let page_daGH = 1
        const limit_daGH = 3        
        if(req.query.page_daGH){
            page_daGH = req.query.page_daGH
            page_daGH = page_daGH < 1 ? page_daGH + 1 : page_daGH
        }        
        let skip_daGH = (page_daGH - 1) * limit_daGH
        const showHDDaGiao = await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false}).skip(skip_daGH).limit(limit_daGH).populate("cart.items.productId").exec()
        
        const showHDDaGiaoo = await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false})
        let doanhThu = 0;
        for(tt of showHDDaGiaoo){
            doanhThu += tt.CanThanhToan
        }

        let numPage_daGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false}).populate("cart.items.productId")).length) / limit_daGH
        numPage_daGH = numPage_daGH - parseInt(numPage_daGH) === 0 ? numPage_daGH : numPage_daGH + 1

        const showHDDaGiaoWithVietnamTime = showHDDaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        // hiển thị đơn hàng khi "Đã hủy đơn hàng"
        let page_DaHuyDH = 1
        const limit_DaHuyDH = 3        
        if(req.query.page_DaHuyDH){
            page_DaHuyDH = req.query.page_DaHuyDH
            page_DaHuyDH = page_DaHuyDH < 1 ? page_DaHuyDH + 1 : page_DaHuyDH
        }        
        let skip_DaHuyDH = (page_DaHuyDH - 1) * limit_DaHuyDH
        const showHDDaHuy = await HuyDonHang.find({ deleted: false}).skip(skip_DaHuyDH).limit(limit_DaHuyDH).populate("cart.items.productId").exec()
        const showHDDaHuyy = await HuyDonHang.find({ deleted: false})

        let numPage_DaHuyDH = parseInt((await HuyDonHang.find({ deleted: false}).populate("cart.items.productId")).length) / limit_DaHuyDH
        numPage_DaHuyDH = numPage_DaHuyDH - parseInt(numPage_DaHuyDH) === 0 ? numPage_DaHuyDH : numPage_DaHuyDH + 1

        const showHDDaHuyWithVietnamTime = showHDDaHuy.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        res.render("AdminQL/TrangQLAdmin/QL_DonHang/quanLyDonHang.ejs", {
            soTrang: numPage, curPage: page, 
            soTrang_dangGH: numPage_dangGH, curPage_dangGH: page_dangGH, 
            soTrang_daGH: numPage_daGH, curPage_daGH: page_daGH, 
            soTrang_daHuyDH: numPage_DaHuyDH, curPage_DaHuyDH: page_DaHuyDH, 
            logged: loggedIn, 
            tk: taikhoan,
            rootPath: '/', 
            formatCurrency: formatCurrency,
            getRelativeImagePath: getRelativeImagePath,
            showHDChuaGiao: showHDChuaGiaoWithVietnamTime,
            showHDDangGiao: showHDDangGiaoWithVietnamTime,
            showHDDaGiao: showHDDaGiaoWithVietnamTime, doanhThu, showHDDaGiaoo,
            showHDDaHuyDH: showHDDaHuyWithVietnamTime, showHDDaHuyy,
            activee
        })
    }   
}