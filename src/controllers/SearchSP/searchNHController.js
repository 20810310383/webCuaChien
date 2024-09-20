const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP")
const LoaiSPNamNu = require("../../models/LoaiSPNamNu")
require('rootpath')();
const cheerio = require('cheerio');

module.exports = {
    searchNH_PhanTrang: async (req, res) => {

        // let redirectUrl = '/search-nuoc-hoa';
        // if (req.query.page) {
        //     const tenSPSearch = req.session.tenSPSearch || req.query.search_nuochoa;
        //     redirectUrl += `?search_nuochoa=${tenSPSearch}&page=${req.query.page}`;
        // }
        // res.redirect(redirectUrl);

        let redirectUrl = '/search-nuoc-hoa';
        const queryParams = req.query.SapXepTheoGia ? `?SapXepTheoGia=${req.query.SapXepTheoGia}` : '';
        if (req.query.page) {
            const tenSPSearch = req.session.tenSPSearch || req.query.search_nuochoa;
            redirectUrl += `?search_nuochoa=${tenSPSearch}&page=${req.query.page}&${queryParams}`;
        }
        res.redirect(redirectUrl);
    },

    // **********************************************************************************
    searchNH_PhanLoai_PhanTrang: async (req, res) => {

        // let redirectUrl = '/search-nuoc-hoa';
        // if (req.query.page) {
        //     const tenloaiNH = req.session.tenSPSearch || req.query.tenloaiNH;
        //     const giaSP = req.session.giaSP || req.query.giaSP;
        //     redirectUrl += `?tenloaiNH=${tenloaiNH}&giaSP=${giaSP}&page=${req.query.page}`;
        // }
        // res.redirect(redirectUrl);

        let redirectUrl = '/search-nuoc-hoa';
        const queryParams = req.query.SapXepTheoGia ? `?SapXepTheoGia=${req.query.SapXepTheoGia}` : '';
        if (req.query.page) {
            const tenloaiNH = req.session.tenSPSearch || req.query.tenloaiNH;
            const giaSP = req.session.giaSP || req.query.giaSP;
            redirectUrl += `${queryParams}&tenloaiNH=${tenloaiNH}&giaSP=${giaSP}&page=${req.query.page}`;           
        }
        res.redirect(redirectUrl);
    },

    searchNH: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active = 'shoplist'

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

        // convert tiền từ số thành dạng có cả chữ. ví dụ: 1000 -> 1M
        function convertPriceRange(range) {
            //const ranges = range.split('-');
            // // const minPrice = parseFloat(ranges[0]);
            // const minPrice = ranges[0] != '' ? parseFloat(ranges[0]) : 0;
            // // const maxPrice = parseFloat(ranges[1]);
            // const maxPrice = ranges[1] != '' ? parseFloat(ranges[1]) : 0;

            // Nếu range không tồn tại hoặc không có giá trị nào được nhập, mặc định cho minPrice và maxPrice là 0
            let [minPrice = 0, maxPrice = 0] = range ? range.split('-').map(parseFloat) : [0, 0];

            
            // Chuyển đổi minPrice và maxPrice thành dạng chuỗi mong muốn
            let formattedMinPrice = minPrice < 1000 ? `${minPrice}k` : `${minPrice / 1000}M`;
            let formattedMaxPrice = maxPrice < 1000 ? `${maxPrice}k` : `${maxPrice / 1000}M`;

            // Kiểm tra nếu giá trị chia cho 1000 là NaN thì sử dụng giá ban đầu
            formattedMinPrice = isNaN(formattedMinPrice) ? `${minPrice}k` : formattedMinPrice;
            formattedMaxPrice = isNaN(formattedMaxPrice) ? `${maxPrice}k` : formattedMaxPrice;

            // Kiểm tra nếu giá trị rỗng, trả về chuỗi "Hãy chọn"
            const finalMinPrice = formattedMinPrice == '' ? 'Hãy' : formattedMinPrice;
            const finalMaxPrice = formattedMaxPrice == '' ? 'Chọn' : formattedMaxPrice;
    
            return `${finalMinPrice} đến ${finalMaxPrice}`;
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


        let page = 1
        const limit = 6
        let tenSPSearch = req.query.search_nuochoa
        let tenloaiNH = req.query.tenloaiNH;
        let giaSP = req.query.giaSP;

        // Lưu trữ giá trị tìm kiếm trong session hoặc cookie
        req.session.tenSPSearch = tenSPSearch;
        req.session.tenloaiNH = tenloaiNH;
        req.session.giaSP = giaSP;

        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }

        let skip = (page - 1) * limit              

        // sắp xếp theo giá
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

        // tìm trên thanh tìm kiếm
        if(tenSPSearch){                   

            // const all = await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }}).populate('IdLoaiSP').populate('IdNam_Nu').exec();
            // const allSPTangDan = await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }}).populate('IdLoaiSP').populate('IdNam_Nu').sort({ GiaBan: 1 }).exec();
            const all = await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }})
                .populate('IdLoaiSP')
                .populate('IdNam_Nu') 
                .sort(sortOption)               
                .skip(skip)
                .limit(limit)
                .exec();
            const loaiSPNamNu = await LoaiSPNamNu.find().exec();

            // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
            let numPage = parseInt((await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }})
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
            // const filteredResults = all.filter(product => product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar"));
    
            // // Áp dụng skip và limit sau khi đã lọc
            // const startIndex = skip;
            // const endIndex = startIndex + limit;
            // const slicedResults = filteredResults.slice(startIndex, endIndex);
    
            // // Tính toán tổng số trang
            // const totalProducts = filteredResults.length;
            // const numPage = Math.ceil(totalProducts / limit);
    
            res.render("TrangChu/layouts/SearchSP/searchShopNuocHoa.ejs", {
                hoten, logIn, active,
                formatCurrency, getRelativeImagePath, rootPath: '/', 
                soTrang: numPage, 
                curPage: page, 
                // all: slicedResults, 
                all,
                searchSPSession: req.session.tenSPSearch || '',
                tenloaiNHSession: '',
                giaSPSession: '',
                loaiSPNamNu,
                ssSAPXEP: req.session.SapXepTheoGia,
                convertPriceRange,
                tongSL, spBanChay,
                convertHtml, ss: req.session.SapXepTheoGia, price, cleanedString: formattedNumber
            })
            
        } else if(tenloaiNH && giaSP) {
            
            const loaiSPNamNu = await LoaiSPNamNu.find().exec();

            let giaRange = giaSP.split('-');
            console.log("gia value: ". giaRange);

            let minPrice = parseInt(giaRange[0]) * 1000; // chuyển 100k thành 100000
            let maxPrice = parseInt(giaRange[1]) * 1000; // chuyển 5M thành 5000000

            console.log(" minPrice: ", minPrice + "\n maxPrice: ", maxPrice);

            const all = await SanPham.find({
                IdNam_Nu: tenloaiNH,
                GiaBan: {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            }).populate('IdLoaiSP').populate('IdNam_Nu').sort(sortOption).skip(skip).limit(limit).exec();
            
            // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
            let numPage = parseInt((await SanPham.find({
                IdNam_Nu: tenloaiNH,
                GiaBan: {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            }).populate('IdLoaiSP').populate('IdNam_Nu').sort(sortOption)).length) / limit

            // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
            // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
            // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
            console.log("tổng số trang cần hiển thị: ", numPage);

            // // Lọc kết quả bằng cách sử dụng filter
            // const filteredResults = all.filter(product => product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar"));
    
            // // Áp dụng skip và limit sau khi đã lọc
            // const startIndex = skip;
            // const endIndex = startIndex + limit;
            // const slicedResults = filteredResults.slice(startIndex, endIndex);
    
            // // Tính toán tổng số trang
            // const totalProducts = filteredResults.length;
            // const numPage = Math.ceil(totalProducts / limit);
    
            res.render("TrangChu/layouts/SearchSP/searchShopNuocHoa.ejs", {
                hoten, logIn, active,
                formatCurrency, getRelativeImagePath, rootPath: '/', convertPriceRange,
                soTrang: numPage, 
                curPage: page, 
                // all: slicedResults,
                all,
                searchSPSession: req.session.tenSPSearch || '',
                tenloaiNHSession: req.session.tenloaiNH || '',
                giaSPSession: req.session.giaSP || '',
                loaiSPNamNu, tongSL, spBanChay,
                convertHtml, ss: req.session.SapXepTheoGia, price, cleanedString: formattedNumber
            })
        } else {
            // Trường hợp không xác định được tiêu chí tìm kiếm
            const all = await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }})
                .populate('IdLoaiSP')
                .populate('IdNam_Nu')
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .exec();
            const loaiSPNamNu = await LoaiSPNamNu.find().exec();

            // // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
            let numPage = parseInt((await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }}).populate('IdLoaiSP').populate('IdNam_Nu').sort(sortOption)).length) / limit

            // // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
            // // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
            // // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
            console.log("tổng số trang cần hiển thị: ", numPage);

            // // Lọc kết quả bằng cách sử dụng filter
            // const filteredResults = all.filter(product => product.IdLoaiSP && (product.IdLoaiSP.TenLoaiSP !== "Avatar"));

            // // Áp dụng skip và limit sau khi đã lọc
            // const startIndex = skip;
            // const endIndex = startIndex + limit;
            // const slicedResults = filteredResults.slice(startIndex, endIndex);

            // // Tính toán tổng số trang
            // const totalProducts = filteredResults.length;
            // const numPage = Math.ceil(totalProducts / limit);

            res.render("TrangChu/layouts/SearchSP/searchShopNuocHoa.ejs", {
                hoten, logIn, active,
                formatCurrency, getRelativeImagePath, rootPath: '/', 
                soTrang: numPage, 
                curPage: page, 
                // all: slicedResults,
                all,
                searchSPSession: req.session.tenSPSearch || '',
                tenloaiNHSession: '',
                giaSPSession: '',
                loaiSPNamNu, convertPriceRange, tongSL, spBanChay,
                convertHtml, ss: req.session.SapXepTheoGia, price, cleanedString: formattedNumber
            })
        }        
    },
}