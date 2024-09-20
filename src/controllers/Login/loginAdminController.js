const TaiKhoan_Admin = require("../../models/TaiKhoan_Admin")
const jwt = require('jsonwebtoken');

//  --------------------------------------------

module.exports = {
    // form đăng nhập
    getLoginAdmin: (req, res) => {
        res.render("AdminQL/LoginAdmin/loginAdmin.ejs");
    },

    // đăng ký tài khoản 
    dangKyAdmin: async (req, res) => {

    },

    // đăng nhập tài khoản
    dangNhapAdmin: async (req, res) => {
        try {
            let tk = req.body.TenDangNhap
            let matkhau = req.body.MatKhau
            console.log("tk: ",tk);
            console.log("matkhau: ",matkhau);
            // Check if the user exists
            const user = await TaiKhoan_Admin.findOne({ TenDangNhap: tk, MatKhau: matkhau, deleted: false });
            if (!user) {
                return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
            }                               
            
            // Tạo token
            // const token = jwt.sign({ tk: tk }, 'SHA384', { expiresIn: '1d' });

            // // Gửi cookie
            // res.cookie("jwt", token, {
            //     httpOnly: true,
            //     expires: new Date(Date.now() + 1000 * 86400), // 1 day
            //     // secure: true, // Sử dụng khi chỉ có kết nối HTTPS
            //     // sameSite: 'None' // Sử dụng khi chạy trong môi trường Cross-Site
            // });

            // Lưu trạng thái đăng nhập vào session
            req.session.loggedIn = true
			req.session.tk = user.HoTen
			req.session.user = user
            console.log("user: ", user); 
        
            return res.status(200).json({ success: true, message: 'Đăng nhập thành công' });
            // res.redirect(`/gethomeAdmin`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // đăng xuất
    dangXuatAdmin: (req, res) => {
        // if (req.session) {
        //     req.session.destroy((err) => {
        //         if (err) {
        //             console.error(err);
        //             res.status(500).send('Internal Server Error');
        //         } else {
        //             // res.clearCookie('connect.sid'); // Xóa cookie connect.sid
        //             // res.cookie('connect.sid', '', { expires: new Date(0) });
        //             res.clearCookie('connect.sid', { path: '/', domain: 'localhost' });
        //             req.session.loggedIn = false
        //             res.redirect('/login-admin');
        //         }
        //     });
        // } else {
        //     res.redirect('/login-admin');
        // }

        if (req.session.tk) {
            req.session.destroy();
            req.session.loggedIn = false
        }
        // req.logout();
        res.redirect("/login-admin");
    },
    dangXuatAdmin1: async (req, res) => { 
        // if (req.session.tk) {
        // }
        // xóa cookie 
        // req.cookie('connect.sid', null);
        // res.clearCookie('connect.sid',{ path: '/' });
        // res.clearCookie('jwt');
        // res.clearCookie('mycookie')
        // req.session.destroy();        

        req.session.destroy(function(){
            res.clearCookie('connect.sid');
            res.clearCookie('jwt');
            res.clearCookie(this.cookie, { path: '/' });
            req.session.destroy(null);
            res.redirect("/login-admin");
        })
        
        res.redirect("/login-admin");
    },
}