const SanPham = require("../../../../models/SanPham")
const LoaiSP = require("../../../../models/LoaiSP")
const LoaiSPNamNu = require("../../../../models/LoaiSPNamNu")
const {uploadSingleFile, uploadMultipleFiles} = require("../../../../services/fileService")
const moment = require('moment-timezone');
require('rootpath')();
// --------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY ');
}

module.exports = {
    // trang nhập liệu để tạo mới sản phẩm
    getCreateNuocHoa: async (req, res) => {
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'active_sanpham'

        let loaiSP = await LoaiSP.find({}).exec()
        console.log("loaiSP: ", loaiSP);

        let loaiSPNamNu = await LoaiSPNamNu.find({}).exec()
        console.log("LoaiSPNamNu: ", loaiSPNamNu);        

        // hiển thị kiểu phân loại
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }

        res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/getCreateNuocHoa.ejs", {
            tk, logged, activee,
            loaiSP, loaiSPNamNu, tongSL
        })
    },

    // xử lý nút tạo mới
    createNuocHoa: async (req, res) => {
        
        let TenSP = req.body.TenSP
        let IdLoaiSP = req.body.IdLoaiSP
        let GiaBan = req.body.GiaBan
        let GiaCu = req.body.GiaCu
        let SoLuongTon = req.body.SoLuongTon
        let MoTa = req.body.MoTa
        let New_Hot = req.body.New_Hot
        let SpMoi_SpNoiBat = req.body.SpMoi_SpNoiBat
        let IdNam_Nu = req.body.IdNam_Nu

        let imageUrl = ""
        let imageUrl1 = ""
        let imageUrl2 = ""
        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            // khong lam gi
        }
        else {
            let kq = await uploadSingleFile(req.files.Image)
            let kq1 = await uploadSingleFile(req.files.Image1)
            let kq2 = await uploadSingleFile(req.files.Image2)
            imageUrl = kq.path
            imageUrl1 = kq1.path
            imageUrl2 = kq2.path
            console.log(">>> check kq: ", kq.path);
        }

        let SP = await SanPham.create({
            TenSP: TenSP, 
            IdLoaiSP: IdLoaiSP, 
            GiaBan: GiaBan, 
            GiaCu: GiaCu, 
            SoLuongTon: SoLuongTon, 
            MoTa: MoTa, 
            New_Hot: New_Hot,            
            Image: imageUrl,
            Image1: imageUrl1,
            Image2: imageUrl2,
            SpMoi_SpNoiBat: SpMoi_SpNoiBat,
            IdNam_Nu: IdNam_Nu 
        })

        if(SP){
            console.log(">>> check kq: ", SP);
            return res.status(200).json({
                message: "Bạn đã thêm mới sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: SP
            })
        } else {
            return res.status(500).json({
                message: "Bạn thêm mới sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }    
    },

}