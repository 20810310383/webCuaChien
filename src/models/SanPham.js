const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const SanPham_Schema = new mongoose.Schema(
    {
        TenSP: { type: String, required: false },
        GiaBan: { type: Number, required: false },
        GiaCu: { type: Number },
        GiamGiaSP: { type: Number },
        MoTa: { type: String, default: "Not thing" },
        New_Hot: { type: String },
        SpMoi_SpNoiBat: { 
            type: String, 
            enum: ["", "Mới", "Nổi Bật"],             
        },
        Size: { 
            type: String, 
            enum: ["100ml", "200ml", "300ml", "400ml"], 
            default: "100ml" 
        },
        MauSac: { type: String },
        SoLuongTon: { type: Number, required: false, default: "100"  },
        SoLuongBan: { type: Number, required: false, default: "100" },
        SoLuotDanhGia: { type: Number, required: false, default: "1000" },
        Image: String,
        Image1: String,
        Image2: String,
        IdLoaiSP: {ref: "LoaiSP", type: mongoose.SchemaTypes.ObjectId},
        IdNam_Nu: {ref: "LoaiSPNamNu", type: mongoose.SchemaTypes.ObjectId},
    },
    { 
        timestamps: true,   // createAt, updateAt
    },
);

// Override all methods
SanPham_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

const SanPham = mongoose.model('SanPham', SanPham_Schema);

module.exports = SanPham;