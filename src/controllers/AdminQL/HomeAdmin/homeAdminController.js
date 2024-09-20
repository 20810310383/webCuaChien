const PhanQuyen = require("../../../models/PhanQuyen")
const ChucNang = require("../../../models/ChucNang")
require('rootpath')();

// --------------------------------------------

module.exports = {
    getHomePageAdmin: (req, res) => {

        let tk = req.session.tk
        let logged = req.session.loggedIn
        let activee = 'trangchu'

        if(logged && tk ){
            res.render("AdminQL/TrangQLAdmin/homeAdmin.ejs", {
                tk, logged, activee
            })
        } else {
            res.render("AdminQL/LoginAdmin/loginAdmin.ejs");
        }        
    },
}   