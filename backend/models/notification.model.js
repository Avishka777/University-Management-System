const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema(
    {
    notificationTitle: { 
        type: String, 
        require: true 
    },
    notificationBody: { 
        type: String 
    }
}, 
{ timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;