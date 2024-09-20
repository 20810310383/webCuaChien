const SanPham = require("../../models/SanPham")
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')();
const cheerio = require('cheerio');

module.exports = {
    contactUs: async (req,res) => {
        let hoten = req.session.hoten
        let logIn = req.session.loggedIn
        let active =''
        res.render("TrangChu/layouts/ContactUs/contactUs.ejs", {
            hoten, logIn, active
        })
    }
}