require('rootpath')();
const SanPham = require("../../models/SanPham")
const {uploadSingleFile, uploadMultipleFiles} = require("../../services/fileService")

module.exports = {

    // tao 1 san pham va upload file anh vao db
    postCreateSP: async (req, res) => {

        let {TenSP, IdLoaiSP, GiaBan, GiaCu, MoTa, New_Hot, Size, SoLuongTon, SoLuongBan, Image, SpMoi_SpNoiBat, IdNam_Nu} = req.body

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
            MoTa: MoTa, 
            New_Hot: New_Hot, 
            Size: Size, 
            SoLuongTon: SoLuongTon, 
            SoLuongBan: SoLuongBan,
            Image: imageUrl,
            Image1: imageUrl1,
            Image2: imageUrl2,
            SpMoi_SpNoiBat: SpMoi_SpNoiBat,
            IdNam_Nu: IdNam_Nu
        })
        
        return res.status(200).json({
            errCode: 0,
            data: SP
        })
    },
}