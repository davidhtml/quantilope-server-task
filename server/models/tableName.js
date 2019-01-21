const mongoose = require('mongoose');

const TableName = mongoose.model('TableName', {
    tableName: {
        type: String,
        default: 'Table name'
    }
});

module.exports = {
    TableName
}
