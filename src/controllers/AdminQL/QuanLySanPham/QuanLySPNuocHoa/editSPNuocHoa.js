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
    // trang nhập liệu để edit sản phẩm
    getEditNuocHoa: async (req, res) => {
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'active_sanpham'
        let idEdit = req.query.idEdit

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

        let loaiSP = await LoaiSP.find({}).exec()        

        let loaiSPNamNu = await LoaiSPNamNu.find({}).exec()
        
        let sanPhamEdit = await SanPham.findById(idEdit).populate('IdLoaiSP').populate('IdNam_Nu').exec()     

        // hiển thị kiểu phân loại
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }

        res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/getEditNuocHoa.ejs", {
            tk, logged, activee,
            rootPath: '/', 
            formatCurrency, getRelativeImagePath,
            loaiSP, loaiSPNamNu, sanPhamEdit, tongSL
        })
    },

    // xử lý nút edit
    handleEditNuocHoa: async (req, res) => {
        let id = req.params.idEdit
        console.log(">>> check id: ",id);
        let TenSP = req.body.TenSP
        let IdLoaiSP = req.body.IdLoaiSP
        let GiaBan = req.body.GiaBan
        let GiaCu = req.body.GiaCu
        let SoLuongTon = req.body.SoLuongTon
        let MoTa = req.body.MoTa
        let New_Hot = req.body.New_Hot
        let SpMoi_SpNoiBat = req.body.SpMoi_SpNoiBat
        let IdNam_Nu = req.body.IdNam_Nu


        let imageUrl = ''
        let imageUrl1 = ''
        let imageUrl2 = ''

        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log(">>> khong co file anh nao trong này ");
            // đoạn này là khi client không nhận được ảnh hiện tại của sp cần edit,
            // thì tự gán = giá trị của 1 value hiển thị link ảnh khác
            imageUrl = req.body.noFileSelected
            imageUrl1 = req.body.noFileSelected1
            imageUrl2 = req.body.noFileSelected2
        }
        else {
            // Lặp qua các tệp được tải lên và lưu đường dẫn vào các biến imageUrl
            if (req.files.Image) {
                let kq = await uploadSingleFile(req.files.Image);
                imageUrl = kq.path;
            }
            if (req.files.Image1) {
                let kq1 = await uploadSingleFile(req.files.Image1);
                imageUrl1 = kq1.path;
            }
            if (req.files.Image2) {
                let kq2 = await uploadSingleFile(req.files.Image2);
                imageUrl2 = kq2.path;
            }
            // let kq = await uploadSingleFile(req.files.Image)
            // let kq1 = await uploadSingleFile(req.files.Image1)
            // let kq2 = await uploadSingleFile(req.files.Image2)
            // imageUrl = kq.path
            // imageUrl1 = kq1.path
            // imageUrl2 = kq2.path
            // console.log(">>> check kq: ", kq.path);
        }

        let updateSP = await SanPham.findByIdAndUpdate({_id: id},{
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

        if(updateSP){
            console.log(">>> check updateSP: ", updateSP);
            return res.status(200).json({
                message: "Bạn đã chỉnh sửa sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: updateSP
            })
        } else {
            return res.status(500).json({
                message: "Bạn chỉnh sửa sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }    
    },

    // **************************************************************
    // trang nhập liệu để edit sản phẩm đã xóa
    getEditNuocHoaDaXoa: async (req, res) => {
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'active_sanpham'
        let idEdit = req.query.idEditDaXoa.trim()
        console.log("idEdit:",idEdit);

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

        let loaiSP = await LoaiSP.find({}).exec()        

        let loaiSPNamNu = await LoaiSPNamNu.find({}).exec()
        
        // tức là tìm theo deleted: true trước rồi lặp for tìm theo idEdit
        const all = await SanPham.findWithDeleted({deleted: true}).populate('IdLoaiSP').populate('IdNam_Nu').exec();
        let sanPhamEdit = null;

        all.forEach(sanPham => {
            if (sanPham._id.toString() === idEdit) {
                sanPhamEdit = sanPham;
                return; // Dừng vòng lặp khi đã tìm thấy sản phẩm cần chỉnh sửa
            }
        });

        console.log("edit: ",sanPhamEdit);
        console.log("sanPhamEdit.Image: ",sanPhamEdit.Image);

        // res.json({data: sanPhamEdit})

        res.render("AdminQL/TrangQLAdmin/QuanLySanPham/QuanLySPNuocHoa/getEditNuocHoaDaXoa.ejs", {
            tk, logged, activee,
            rootPath: '/', 
            formatCurrency, getRelativeImagePath,
            loaiSP, loaiSPNamNu, sanPhamEdit
        })
    },

    // xử lý nút edit sản phẩm đã xóa
    handleEditNuocHoaDaXoa: async (req, res) => {
        let idEdit = req.params.idEditDaXoa
        console.log(">>> check params idEdit: ",idEdit);
        let TenSP = req.body.TenSP
        let IdLoaiSP = req.body.IdLoaiSP
        let GiaBan = req.body.GiaBan
        let GiaCu = req.body.GiaCu
        let SoLuongTon = req.body.SoLuongTon
        let MoTa = req.body.MoTa
        let New_Hot = req.body.New_Hot
        let SpMoi_SpNoiBat = req.body.SpMoi_SpNoiBat
        let DaXoa = req.body.daxoa
        let IdNam_Nu = req.body.IdNam_Nu

        console.log("daxoa: ",DaXoa);
        
        let imageUrl = ''
        let imageUrl1 = ''
        let imageUrl2 = ''

        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log(">>> khong co file anh nao trong này ");
            // đoạn này là khi client không nhận được ảnh hiện tại của sp cần edit,
            // thì tự gán = giá trị của 1 value hiển thị link ảnh khác
            imageUrl = req.body.noFileSelected
            imageUrl1 = req.body.noFileSelected1
            imageUrl2 = req.body.noFileSelected2
        }
        else {
            // Lặp qua các tệp được tải lên và lưu đường dẫn vào các biến imageUrl
            if (req.files.Image) {
                let kq = await uploadSingleFile(req.files.Image);
                imageUrl = kq.path;
            }
            if (req.files.Image1) {
                let kq1 = await uploadSingleFile(req.files.Image1);
                imageUrl1 = kq1.path;
            }
            if (req.files.Image2) {
                let kq2 = await uploadSingleFile(req.files.Image2);
                imageUrl2 = kq2.path;
            }
        }

        try {
            // Tìm tất cả các sản phẩm đã xóa
            const allDeletedProducts = await SanPham.findWithDeleted({ deleted: true }).populate('IdLoaiSP').populate('IdNam_Nu').exec();
            console.log("allDeletedProducts: ",allDeletedProducts);
            // Tìm sản phẩm cần cập nhật dựa trên idEdit
            const productToUpdate = allDeletedProducts.find(product => String(product._id) === idEdit);
            console.log("productToUpdate: ",productToUpdate);
        
            if (!productToUpdate) {
                return res.status(404).json({
                    message: "Không tìm thấy sản phẩm cần cập nhật!",
                    success: false,
                    errCode: -1,
                });
            }

            productToUpdate.TenSP = TenSP 
            productToUpdate.IdLoaiSP = IdLoaiSP 
            productToUpdate.GiaBan = GiaBan 
            productToUpdate.GiaCu = GiaCu
            productToUpdate.SoLuongTon = SoLuongTon
            productToUpdate.MoTa = MoTa
            productToUpdate.New_Hot = New_Hot            
            productToUpdate.Image = imageUrl
            productToUpdate.Image1 = imageUrl1
            productToUpdate.Image2 = imageUrl2
            productToUpdate.SpMoi_SpNoiBat = SpMoi_SpNoiBat
            productToUpdate.deleted = DaXoa
            productToUpdate.IdNam_Nu = IdNam_Nu

            try {
                const updatedProduct = await productToUpdate.save();
            
                console.log(">>> check updatedProduct: ", updatedProduct);
                return res.status(200).json({
                    message: "Bạn đã chỉnh sửa sản phẩm thành công!",
                    success: true,
                    errCode: 0,
                    data: updatedProduct
                });
            } catch (error) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
                return res.status(500).json({
                    message: "Có lỗi xảy ra khi cập nhật sản phẩm!",
                    success: false,
                    errCode: -1,
                });
            }
        
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi cập nhật sản phẩm!",
                success: false,
                errCode: -1,
            });
        }
    },
}