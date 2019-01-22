const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rowSchema = new Schema({
    label: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: 'row'
    },
    image: {
        type: Object,
        default: {},
        data: Buffer,
        contentType: String
    },
    checked: {
        type: String,
        default: ''
    }
})
const Row = mongoose.model('Row', rowSchema);

module.exports = {
    Row
}
