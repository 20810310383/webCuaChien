const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP")
const LoaiSPNamNu = require("../../models/LoaiSPNamNu")
require('rootpath')();
const cheerio = require('cheerio');


module.exports = {
    getHomeListShopPhanLoaiNam_PhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/shop-list-phan-loai-nuoc-hoa-nam?page=${req.query.page}`)
        }
        res.redirect(`/shop-list-phan-loai-nuoc-hoa-nam`)
    },

    getHomeListShopPhanLoaiNam: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = 'phanloai'
        let idPL = req.body.idPL
        req.session.idPL = idPL;

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
        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }

        let skip = (page - 1) * limit

        // hiển thị kiểu phân loại
        let loaiSP = await LoaiSP.find().exec();
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }
        
        // sản phẩm bán chạy (SoLuongBan > 100)
        const spBanChay = await SanPham.find({ SoLuongBan: { $gt: 200 } });

        const all = await SanPham.find().populate('IdLoaiSP').populate('IdNam_Nu').exec();
        const loaiSPNamNu = await LoaiSPNamNu.find().exec();

        // Lọc kết quả bằng cách sử dụng filter
        const filteredResults = all.filter(product => 
            product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar") && 
            product.IdNam_Nu && (product.IdNam_Nu.TenLoaiNamNu === "nam"));

        // Áp dụng skip và limit sau khi đã lọc
        const startIndex = skip;
        const endIndex = startIndex + limit;
        const slicedResults = filteredResults.slice(startIndex, endIndex);

        // Tính toán tổng số trang
        const totalProducts = filteredResults.length;
        const numPage = Math.ceil(totalProducts / limit);

        console.log("Tổng Products: ", totalProducts);
        console.log("numPage", numPage);

        res.render("TrangChu/layouts/PhanLoaiSP/phanLoaiNuocHoa.ejs", {
            hoten, logIn, active,
            rootPath: '/', 
            formatCurrency, getRelativeImagePath,
            soTrang: numPage, 
            curPage: page, 
            all: slicedResults,
            loaiSPNamNu, convertHtml,
            searchSPSession: req.session.idPL, tongSL, spBanChay,
            ss: req.session.SapXepTheoGia
        })
    },

    getHomeListShopPhanLoaiNu_PhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/shop-list-phan-loai-nuoc-hoa-nu?page=${req.query.page}`)
        }
        res.redirect(`/shop-list-phan-loai-nuoc-hoa-nu`)
    },

    getHomeListShopPhanLoaiNu: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = 'phanloai'
        let idPL = req.body.idPL
        req.session.idPL = idPL;

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

        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }

        let skip = (page - 1) * limit

        // hiển thị kiểu phân loại
        let loaiSP = await LoaiSP.find().exec();
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }
        
        // sản phẩm bán chạy (SoLuongBan > 100)
        const spBanChay = await SanPham.find({ SoLuongBan: { $gt: 200 } });

        const all = await SanPham.find().populate('IdLoaiSP').populate('IdNam_Nu').exec();
        const loaiSPNamNu = await LoaiSPNamNu.find().exec();

        // Lọc kết quả bằng cách sử dụng filter
        const filteredResults = all.filter(product => 
            product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar") && 
            product.IdNam_Nu && (product.IdNam_Nu.TenLoaiNamNu === "nữ"));

        // Áp dụng skip và limit sau khi đã lọc
        const startIndex = skip;
        const endIndex = startIndex + limit;
        const slicedResults = filteredResults.slice(startIndex, endIndex);

        // Tính toán tổng số trang
        const totalProducts = filteredResults.length;
        const numPage = Math.ceil(totalProducts / limit);

        console.log("Tổng Products: ", totalProducts);
        console.log("numPage", numPage);

        res.render("TrangChu/layouts/PhanLoaiSP/phanLoaiNuocHoa.ejs", {
            hoten, logIn, active,
            rootPath: '/', 
            formatCurrency, getRelativeImagePath,
            soTrang: numPage, 
            curPage: page, 
            all: slicedResults,
            loaiSPNamNu, 
            searchSPSession: req.session.idPL, tongSL, spBanChay,
            convertHtml,
            ss: req.session.SapXepTheoGia
        })
    },


}