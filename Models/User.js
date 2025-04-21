const mongoose=require('mongoose');
const joi=require('joi');
const passwordComplexity=require('joi-password-complexity');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: Number, required: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SPECIAL', 'ADMIN', 'NORMAL'], required: true },
    image: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    school: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }]
});

const validateUser = (data) => {
     const schema = joi.object({
          firstName: joi.string().required().label('First Name'),
          lastName: joi.string().required().label('Last Name'),
          email: joi.string().email().required().label('Email'),
          phone: joi.number().required().label('Phone Number'),
          password: passwordComplexity().required().label('Password'),
          image: joi.allow(null).label('Image'),

     });
     return schema.validate(data);
};


const validatePasswordComplexity = (data)=>{
     const schema = joi.object({
          password: passwordComplexity().required().label('Password'),
     });
     return schema.validate(data);
}

const validateOnLogin = (data) => {
     const schema = joi.object({
          email_phone: joi.string().required().label('Email/Phone'),
          password: joi.string().required().label('Password'),
     });
     return schema.validate(data);
};

const User=mongoose.model('User',userSchema);
module.exports={
     User,
     validateUser,
     validatePasswordComplexity,
     validateOnLogin,
 }
