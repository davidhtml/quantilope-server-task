const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnSchema = new Schema({
    label: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: 'col'
    },
    image: {
      type: String,
      default: undefined,
    },
    checked: {
        type: String,
        default: ''
    }
})

const Column = mongoose.model('Column', columnSchema);

module.exports = {
    Column
}
