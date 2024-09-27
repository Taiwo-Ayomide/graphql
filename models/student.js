const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const studentSchema = new Schema({
    firstname: String,
    lastname: String,
    age: String,
    sex: String,
    religion: String,
    phone: String,
    email: String,
    state: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
});

module.exports = moongoose.model('Student', studentSchema);