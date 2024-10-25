require('dotenv').config();
//Database
const mongoose = require('mongoose');
let URI = process.env.URI;
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
}

//onnect
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
});
mongoose.connect(URI, opts);


const db = mongoose.connection
db.on('error', (error) => {
    console.error('Lỗi kết nối đến MongoDB:', error);
});

db.once('open', () => {
    console.log('Đã kết nối thành công đến MongoDB!');
});

module.exports = db;