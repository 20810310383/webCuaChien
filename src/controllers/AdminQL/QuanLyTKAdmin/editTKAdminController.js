const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin")

// --------------------------------------------

module.exports = {

    // get trang nhập liệu edit
    getEditTKAdmin: async (req, res) =>{
        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'danhmucquanly'

        let idEdit = req.query.idEdit
        console.log("idEdit: ", idEdit);

        // tức là tìm theo deleted: true trước rồi lặp for tìm theo idEdit
        const all = await TaiKhoan_Admin.find({deleted: true})
        let taiKhoanEdit = null;
        all.forEach(taiKhoan => {
            if (taiKhoan._id.toString() === idEdit) {
                taiKhoanEdit = taiKhoan;
                return; // Dừng vòng lặp khi đã tìm thấy sản phẩm cần chỉnh sửa
            }
        });

        if(taiKhoanEdit != null){
            console.log("nullllllllllll");
            res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdmin/getEditTKAdmin.ejs", {
                tk, logged, activee, tkEdit: taiKhoanEdit
            })
        } else {
            console.log("đéo  nullllllllllll");
            let tkEdit = await TaiKhoan_Admin.findById(idEdit)

            if(tkEdit) {
                res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdmin/getEditTKAdmin.ejs", {
                    tk, logged, activee, tkEdit
                })
            } else {
                return res.status(404).json({message: "Không tìm thấy account khách hàng này!"})
            }    
        }

        // --------------------------------------------------
        // let tkEdit = await TaiKhoan_Admin.findById(idEdit)

        // if(tkEdit) {
        //     res.render("AdminQL/TrangQLAdmin/QL_TaiKhoanAdmin/getEditTKAdmin.ejs", {
        //         tk, logged, activee, tkEdit
        //     })
        // } else {
        //     return res.status(404).json({message: "Không tìm thấy account khách hàng này!"})
        // }    
    },

    // xử lý nút save tài khoản khách hàng
    // editTKAdmin1 là code cũ (đang sai)
    editTKAdmin1: async (req, res) => {

        try {
            let idDeEdit = req.params.idDeEdit
            let TenDangNhap = req.body.TenDangNhap
            let HoTen = req.body.HoTen
            let MatKhau = req.body.MatKhau
            let Deleted = req.body.Deleted

            // Tìm tất cả các tk đã xóa
            const allDeletedProducts = await TaiKhoan_Admin.find({ deleted: true }).exec();
            const allDeletedProducts_false = await TaiKhoan_Admin.find({ deleted: false }).exec();
            console.log("allDeletedProducts: ",allDeletedProducts);

            if(allDeletedProducts.length > 0){
                // Tìm tk cần cập nhật dựa trên idEdit
                const productToUpdate = allDeletedProducts.find(product => String(product._id) === idDeEdit);
                console.log("productToUpdate: ",productToUpdate);

                if (!productToUpdate) {
                    return res.status(404).json({
                        message: "Không tìm thấy tài khoản cần cập nhật!",
                        success: false,
                        errCode: -1,
                    });
                }
                console.log("Deleted: ", Deleted);
                productToUpdate.TenDangNhap = TenDangNhap 
                productToUpdate.HoTen = HoTen 
                productToUpdate.MatKhau = MatKhau 
                productToUpdate.deleted = Deleted            

                try {
                    const updatedProduct = await productToUpdate.save();

                    console.log(">>> check updatedProduct: ", updatedProduct);
                    return res.status(200).json({
                        message: "Bạn đã chỉnh sửa tài khoản thành công!",
                        success: true,
                        errCode: 0,
                        data: updatedProduct
                    });
                } catch (error) {
                    console.error("Lỗi khi cập nhật tài khoản:", error);
                    return res.status(500).json({
                        message: "Có lỗi xảy ra khi cập nhật tài khoản!",
                        success: false,
                        errCode: -1,
                    });
                }

            } 

            console.log("Deleted not null: ", Deleted);
            let updateAdmin = await TaiKhoan_Admin.updateOne({_id: idDeEdit}, {
                TenDangNhap: TenDangNhap,
                HoTen: HoTen,
                MatKhau: MatKhau,
                deleted: Deleted
            })
                
            if(updateAdmin){
                console.log("updateAdmin: ", updateAdmin);
                return res.status(200).json({
                    message: "Bạn đã chỉnh sửa tài khoản admin thành công!",
                    success: true,
                    KQ: 0,
                    data: updateAdmin
                })
            } else {
                return res.status(204).json({
                    message: "Chỉnh sửa thất bại! Vui lòng thử lại",
                    success: false,                
                })
            }
            
        
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi cập nhật tài khoản!",
                success: false,
                errCode: -1,
            });
        }     
    },

    editTKAdmin: async (req, res) => {
        try {
            let idDeEdit = req.params.idDeEdit;
            let TenDangNhap = req.body.TenDangNhap;
            let HoTen = req.body.HoTen;
            let MatKhau = req.body.MatKhau;
            let Deleted = req.body.Deleted;
        
            // Tìm tất cả các tk đã xóa
            const allDeletedProducts = await TaiKhoan_Admin.find({ deleted: true }).exec();
            const allDeletedProducts_false = await TaiKhoan_Admin.find({ deleted: false }).exec();
            console.log("allDeletedProducts: ", allDeletedProducts);
        
            let productToUpdate;
        
            // Kiểm tra xem có sản phẩm cần cập nhật trong danh sách sản phẩm đã xóa hay không
            if (allDeletedProducts.length > 0) {
                productToUpdate = allDeletedProducts.find(product => String(product._id) === idDeEdit);
            }
        
            // Nếu không tìm thấy sản phẩm trong danh sách đã xóa, kiểm tra danh sách sản phẩm chưa xóa
            if (!productToUpdate && allDeletedProducts_false.length > 0) {
                productToUpdate = allDeletedProducts_false.find(product => String(product._id) === idDeEdit);
            }
        
            if (!productToUpdate) {
                return res.status(404).json({
                    message: "Không tìm thấy tài khoản cần cập nhật!",
                    success: false,
                    errCode: -1,
                });
            }
        
            console.log("Deleted: ", Deleted);
            productToUpdate.TenDangNhap = TenDangNhap;
            productToUpdate.HoTen = HoTen;
            productToUpdate.MatKhau = MatKhau;
            productToUpdate.deleted = Deleted;
        
            try {
                const updatedProduct = await productToUpdate.save();
        
                console.log(">>> check updatedProduct: ", updatedProduct);
                return res.status(200).json({
                    message: "Bạn đã chỉnh sửa tài khoản thành công!",
                    success: true,
                    errCode: 0,
                    data: updatedProduct
                });
            } catch (error) {
                console.error("Lỗi khi cập nhật tài khoản:", error);
                return res.status(500).json({
                    message: "Có lỗi xảy ra khi cập nhật tài khoản!",
                    success: false,
                    errCode: -1,
                });
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi cập nhật tài khoản!",
                success: false,
                errCode: -1,
            });
        }
        
    }
}