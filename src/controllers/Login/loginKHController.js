const TaiKhoan_KH = require("../../models/TaiKhoan_KH")
const Cart = require("../../models/Cart")

module.exports = {

    getFormLoginKH: async (req, res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active =''
        res.render("KhachHang/loginKH.ejs", {
            hoten, logIn, active
        })
    },
    
    dangKyTKKH: async (req, res) => {

        try {
            let emaildk = req.body.emaildk
            let hoten = req.body.name
            let passdk = req.body.passdk
    
            console.log(" emaildk: ", emaildk, "\n hoten: ",hoten, "\n passdk: ",passdk);

            const kt = await TaiKhoan_KH.findOne({ TenDangNhap: emaildk, deleted: false });
            if (kt) {
                // return res.status(400).json({ message: 'Tài Khoản Đã Tồn Tại' });
                return res.status(400).json({ success: false, message: 'Tài Khoản Đã Tồn Tại! Vui Lòng Chọn Email Khác!' });
                // return res.status(400).send("Tài Khoản Đã Tồn Tại")
            }    
    
            let dangKy = await TaiKhoan_KH.create({
                TenDangNhap: emaildk,
                MatKhau: passdk,
                HoTen: hoten
            })        
            return res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công', dangKy });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        }
    },

    dangNhapTKKH: async (req, res) => {
        try {
            let username_email = req.body.username_email
            let passLogin = req.body.passLogin

            console.log(" username_email: ", username_email, "\n passLogin: ",passLogin);
            // Mặc định đặt loggedIn là false
            req.session.loggedIn = false;

            // Check if the user exists
            const user = await TaiKhoan_KH.findOne({ TenDangNhap: username_email, MatKhau: passLogin, deleted: false });
            if (!user) {            
                return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại!' });
            }                      

            req.session.loggedIn = true
            req.session.taikhoan = username_email
            req.session.hoten = user.HoTen
            req.session.userId = user._id
            req.user = { _id: user._id };

            if (user) {
                // Nếu đã đăng nhập, kiểm tra xem có giỏ hàng trong database không
                let cart = await Cart.findOne({ 'MaTKKH': user._id });

                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: user._id,
                    });
                    await cart.save();
                }

                // Đặt thông tin giỏ hàng trong phiên
                req.session.cartId = cart._id;
            }

            console.log("req.session.hoten: ", req.session.hoten);

            return res.status(201).json({ success: true, message: 'Đăng nhập tài khoản thành công!' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        }
    },

    dangXuatTKKH: async (req, res) => {

        if (req.session.taikhoan) {
            if (req.session.cartId) {
                // Nếu có giỏ hàng, xóa giỏ hàng
                req.session.cartId = null;                
            }
            req.session.destroy();
        }
        res.redirect("/")
    }
}