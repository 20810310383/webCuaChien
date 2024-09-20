const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP")
require('rootpath')();

module.exports = {
    getHomeHienThi1: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = 'home'

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
        // Đoạn mã JavaScript để chuyển đổi HTML thành văn bản
        function convertHtml(html) {
            const $ = cheerio.load(html);
            return $('body').text();
        }

        // hiển thị kiểu phân loại
        let loaiSP = await LoaiSP.find().exec();
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }
        
        // sản phẩm bán chạy (SoLuongBan > 100)
        const spBanChay = await SanPham.find({ SoLuongBan: { $gt: 200 } });
        
        // Hiển thị 1: select tất cả sp KHÔNG PHẢI LÀ Avatar
        const TimSpNew = await SanPham.find({ SpMoi_SpNoiBat: "Mới" }).populate("IdLoaiSP");
        const spNew = TimSpNew.filter(product => product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar" ));

        const TimSpNoiBat = await SanPham.find({ SpMoi_SpNoiBat: "Nổi Bật" }).populate("IdLoaiSP");
        const spNoiBat = TimSpNoiBat.filter(product => product.IdLoaiSP && product.IdLoaiSP.TenLoaiSP !== "Avatar");        


        res.render("home.ejs", {
            hoten, logIn, active,
            rootPath: '/', 
            formatCurrency, getRelativeImagePath, convertHtml,
            spNew, spNoiBat, tongSL, spBanChay
            
        })

        // res.json({
        //     messageCode: "Success",
        //     hoten,
        //     logIn,
        //     formatCurrency, getRelativeImagePath,
        //     rootPath: '/',
        //     spNew,
        //     spNoiBat
        // });
    },    

}