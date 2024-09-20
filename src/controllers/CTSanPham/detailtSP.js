const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')();
const cheerio = require('cheerio');

module.exports = {
    chiTietSPHomeHienThi1: async (req, res) => {

        try {
            // Đoạn mã JavaScript để chuyển đổi HTML thành văn bản
            function convertHtml(html) {
                const $ = cheerio.load(html);
                return $('body').text();
            }

            const productId = req.body.idDetailtSPP;
            console.log("productId: ",productId);
            const productDetails = await SanPham.findById(productId).populate("IdLoaiSP");
            console.log("productDetails: ",productDetails);
            res.json({
                productDetails,
                
                // name: productDetails.TenSP,
                // Image: productDetails.Image,
                // newPrice: productDetails.GiaBan,
                // oldPrice: productDetails.GiaCu,
                // description: productDetails.MoTa,
                // sizeOptions: ["S", "M", "L", "XL", "XXL"],  // Example, replace with actual size options
                // Add other details as needed
            });
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    chiTietSPHomeHienThi1_ChiTiet: async (req, res) => {

        try {
            let hoten = req.session.hoten
            let logIn = req.session.loggedIn
            let active =''

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
            // sản phẩm bán chạy (SoLuongBan > 200)
            const spBanChay = await SanPham.find({ SoLuongBan: { $gt: 200 } });

            // lọc sản phẩm theo giá (kéo dạng trượt)
            let cleanedString = req.query.price || "0-9999999";   
            console.log("cleanedString: ", cleanedString);        

            let convert_string = cleanedString.replace(/[^\d-]/g, '');
            console.log("convert_string: ", convert_string);

            req.session.price = convert_string
            const price = req.session.price
            
            let valuesArray = price.split('-');
            console.log("valuesArray: ", valuesArray);
            
            let giatri1 = parseFloat(valuesArray[0]);
            let giatri2 = parseFloat(valuesArray[1]);
            console.log("giatri1: ", giatri1);
            console.log("giatri2: ", giatri2);
            
            function formatNumber(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            function formatRangeString(rangeString) {
                const parts = rangeString.split('-');
                const firstPart = formatNumber(parts[0]);
                const secondPart = formatNumber(parts[1]);
                return `${firstPart}  -  ${secondPart}`;
            }
            let formattedNumber = formatRangeString(cleanedString);
            console.log(formattedNumber); 

            // Hiển thị 1: select tất cả sp KHÔNG PHẢI LÀ Avatar
            const TimSpNoiBat = await SanPham.find({ SpMoi_SpNoiBat: "Nổi Bật" }).populate("IdLoaiSP");
            const spNoiBat = TimSpNoiBat.filter(product => product.IdLoaiSP && product.IdLoaiSP.TenLoaiSP !== "Avatar");       


            const productId = req.query.idDetailtSP;
            const productDetails = await SanPham.findById(productId).populate("IdLoaiSP");
            
            res.render("TrangChu/layouts/DetailtSP/detailtProductHT1.ejs", {
                hoten, logIn,
                rootPath: '/', 
                formatCurrency, getRelativeImagePath, convertHtml,
                spNoiBat,   
                productDetails, active,
                tongSL, spBanChay, price, cleanedString: formattedNumber
            })
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}