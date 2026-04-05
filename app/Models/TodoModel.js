import { Schema, model } from 'mongoose';

const TodoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: [true, 'Title must be unique'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title must be less than 100 characters long']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default model('Todo', TodoSchema);