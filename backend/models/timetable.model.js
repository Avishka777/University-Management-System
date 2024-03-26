import mongoose from 'mongoose';

const timeTableSchema = new mongoose.Schema(
    {
    classSession: { 
        type: String, 
        require: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'courses' 
    },
    day: { 
        type: String, 
        require: true 
    },
    time: { 
        type: String, 
        require: true 
    },
    faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users' 
    },
    location: { 
        type: String, 
        require: true 
    },

}, { timestamps: true })

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

export default TimeTable;