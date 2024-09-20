const express = require('express');
const router = express.Router();
const { postCreateSP } = require("../controllers/TrangChu/homeAPIController");
const { chiTietSPHomeHienThi1 } = require('../controllers/CTSanPham/detailtSP');
//-----------------------------------------

router.post("/create", postCreateSP)
router.get("/detailt-sp", chiTietSPHomeHienThi1)

module.exports = router;