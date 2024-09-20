const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const LoaiSPNamNu_Schema = new mongoose.Schema(
    {
        TenLoaiNamNu: { type: String, required: false, enum: ["nam", "nữ"], },
    },

);

// Override all methods
LoaiSPNamNu_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

const LoaiSPNamNu = mongoose.model('LoaiSPNamNu', LoaiSPNamNu_Schema);

module.exports = LoaiSPNamNu;