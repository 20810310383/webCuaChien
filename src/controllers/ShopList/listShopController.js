const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP")
const LoaiSPNamNu = require("../../models/LoaiSPNamNu")
require('rootpath')();
const cheerio = require('cheerio');


module.exports = {
    getHomeListShop_PhanTrang: (req, res) => { 

        let redirectUrl = '/shop-list-ht1';
        const queryParams = req.query.SapXepTheoGia ? `?SapXepTheoGia=${req.query.SapXepTheoGia}` : '';
        if (req.query.page) {
            // redirectUrl += `${queryParams}&page=${req.query.page}`;
            const price = req.session.price || req.query.price || "0-9999999"; // Lấy giá từ session hoặc query
            redirectUrl += `${queryParams}&page=${req.query.page}`;
            if (!req.query.price && price) {
                redirectUrl += `&price=${price}`; // Thêm tham số price vào queryParams nếu tồn tại
            }
        }
        res.redirect(redirectUrl);
    },
    getHomeListShop_TheoLoai_PhanTrang: (req, res) => { 

        let redirectUrl = '/shop-list-ht1';
        const queryParams = req.query.SapXepTheoGia ? `?SapXepTheoGia=${req.query.SapXepTheoGia}` : '';
        if (req.query.page) {
            const idPL = req.query.idPL;
            const price = req.session.price || req.query.price || "0-9999999";
            redirectUrl += `${queryParams}&idPL=${idPL}&page=${req.query.page}`;
            if (!req.query.price && price) {
                redirectUrl += `&price=${price}`; // Thêm tham số price vào queryParams nếu tồn tại
            }
        }
        res.redirect(redirectUrl);
    },

    getHomeListShop: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = 'shoplist'
        let idPL = req.query.idPL
        req.session.idPL = idPL;

        console.log("idPL: ", idPL);
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


        // sắp xếp sản phẩm theo giá
        let SapXepTheoGia = 0; // Mặc định là ko sắp xếp 
        if (req.query.SapXepTheoGia) {
            SapXepTheoGia = parseInt(req.query.SapXepTheoGia);
        }
        req.session.SapXepTheoGia = SapXepTheoGia

        let sortOption = {};
        if (SapXepTheoGia === 1) {
            sortOption = { GiaBan: 1 }; // Sắp xếp theo giá tăng dần
        } else if (SapXepTheoGia === -1) {
            sortOption = { GiaBan: -1 }; // Sắp xếp theo giá giảm dần
        } else {
            sortOption = {  };
        }
        
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

        if(!idPL){            

            // const all = await SanPham.find({  }).populate('IdLoaiSP').sort(sortOption).skip(skip).limit(limit).exec();
            const all = await SanPham.find({ GiaBan: { $gte: giatri1, $lte: giatri2 } }).populate('IdLoaiSP').sort(sortOption).skip(skip).limit(limit).exec();
            const loaiSPNamNu = await LoaiSPNamNu.find().exec();
            
            // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
            let numPage = parseInt((await SanPham.find({GiaBan: { $gte: giatri1, $lte: giatri2 }})
            .populate('IdLoaiSP')
            .populate('IdNam_Nu')  
            .sort(sortOption)
            ).length) / limit

            // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
            // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
            // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
            console.log("tổng số trang cần hiển thị: ", numPage);            

            res.render("TrangChu/layouts/ShopList/listShopNuocHoa.ejs", {
                hoten, logIn, active,
                rootPath: '/', 
                formatCurrency, getRelativeImagePath,
                soTrang: numPage, 
                curPage: page, 
                all,
                loaiSPNamNu, tongSL, 
                searchSPSession: req.session.idPL,
                spBanChay,
                convertHtml,
                ss: req.session.SapXepTheoGia, SapXepTheoGia, price, cleanedString: formattedNumber
            })
        } else {
            // const all = await SanPham.find( {IdLoaiSP: idPL}).populate('IdLoaiSP').sort(sortOption).skip(skip).limit(limit).exec();
            const all = await SanPham.find({ GiaBan: { $gte: giatri1, $lte: giatri2 }, IdLoaiSP: idPL }).populate('IdLoaiSP').sort(sortOption).skip(skip).limit(limit).exec();
            const loaiSPNamNu = await LoaiSPNamNu.find().exec();

            // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
            let numPage = parseInt((await SanPham.find({ GiaBan: { $gte: giatri1, $lte: giatri2 }, IdLoaiSP: idPL })
            .populate('IdLoaiSP')
            .populate('IdNam_Nu')
            .sort(sortOption)
            ).length) / limit

            // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
            // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
            // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
            console.log("tổng số trang cần hiển thị: ", numPage);

            // // Lọc kết quả bằng cách sử dụng filter
            // const filteredResults = all.filter(product => product.IdLoaiSP );

            // // Áp dụng skip và limit sau khi đã lọc
            // const startIndex = skip;
            // const endIndex = startIndex + limit;
            // const slicedResults = filteredResults.slice(startIndex, endIndex);

            // // Tính toán tổng số trang
            // const totalProducts = filteredResults.length;
            // const numPage = Math.ceil(totalProducts / limit);

            // console.log("Tổng Products: ", totalProducts);
            // console.log("numPage", numPage);

            res.render("TrangChu/layouts/ShopList/listShopNuocHoa.ejs", {
                hoten, logIn, active,
                rootPath: '/', 
                formatCurrency, getRelativeImagePath,
                soTrang: numPage, 
                curPage: page, 
                // all: slicedResults,
                all,
                loaiSPNamNu, tongSL, 
                searchSPSession: req.session.idPL,
                spBanChay,
                convertHtml,
                ss: req.session.SapXepTheoGia, price, cleanedString: formattedNumber
            })
        }
    },


}