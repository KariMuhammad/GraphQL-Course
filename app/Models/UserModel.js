import { Schema, model } from 'mongoose';

const User = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]{3,8}(@)(gmail|yahoo)(.com)$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
});

export default model('User', User);