import mongoose from 'mongoose';

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

export default Notification;