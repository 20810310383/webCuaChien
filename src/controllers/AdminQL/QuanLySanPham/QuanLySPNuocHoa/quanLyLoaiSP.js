const SanPham = require("../../../../models/SanPham")
const LoaiSP = require("../../../../models/LoaiSP")
const LoaiSPNamNu = require("../../../../models/LoaiSPNamNu")
const PhanQuyen = require("../../../../models/PhanQuyen")
const TaiKhoan_Admin = require("../../../../models/TaiKhoan_Admin")
const ChucNang = require("../../../../models/ChucNang")

require('rootpath')();
const cheerio = require('cheerio');
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
    // hiển thị trang quản lý loại sản phẩm
    trangLoaiSP: async (req, res) => {
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'active_sanpham'

        // phân quyền 
        if(await KiemTraChucNang(req, '65fffd74a8a948b402a806dd') === false){
            // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
            return res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/error404_KhongCoQuyen.ejs", {
                tk, logged, activee,                        
            })
        }

        let all = await LoaiSP.find({})

        // hiển thị kiểu phân loại
        const tongSL = [];
        for (const loaiSp of all) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }

        res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/getQuanLyLoaiSP.ejs", {
            tk, logged, activee,
            all, tongSL
        })

    },

    // xoá loại sản phẩm
    deleteLoaiSP: async (req, res) => {
        let idxoaLoaiSP = req.params.idxoaLoaiSP
        console.log("idxoaLoaiSP: ", idxoaLoaiSP)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaSP = await LoaiSP.deleteOne({_id: idxoaLoaiSP})

        return res.status(200).json({
            message: "Bạn đã xóa loại sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaSP
        })
    },

    // sửa loại sản phẩm
    suaLoaiSP: async (req, res) => {
        // let idSua = req.body.idSua
        let idSua = req.params.idsualoai
        let TenLoaiSP = req.body.TenLoaiSP
        console.log("idSua: ", idSua);
        console.log("TenLoaiSP: ", TenLoaiSP);

        let loaisp = await LoaiSP.findOne({_id: idSua})
        loaisp.TenLoaiSP = TenLoaiSP
        let sua = await loaisp.save();

        if(sua){
            return res.redirect("/trang-quan-ly-loaisp");
            // return res.status(200).json({success: true, message: `Chỉnh sửa tên loại thành công!`, data: sua });
        } else {
            return res.status(200).json({success: false, message: `Chỉnh sửa tên loại thất bại!` });
        }
    },

    // form và xử lý nút thêm loại sản phẩm
    themLoaiSP: async (req, res) => {
        let ThemTenLoaiSP = req.body.ThemTenLoaiSP
        console.log("ThemTenLoaiSP: ", ThemTenLoaiSP);

        let createLoaiSP = await LoaiSP.create({TenLoaiSP: ThemTenLoaiSP})
        
        if(createLoaiSP){
            console.log("createLoaiSP: ", createLoaiSP);
            return res.status(200).json({
                message: "Thêm tên loại sản phẩm thành công!",
                success: true,
                KQ: 0,
                data: createLoaiSP
            })
        } else {
            return res.status(500).json({
                message: "Tạo tên loại sản phẩm thất bại! Vui lòng thử lại",
                success: false,   
                KQ: -1             
            })
        }   
    },
}