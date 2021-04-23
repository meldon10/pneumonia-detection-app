const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

//Radiography schema
const radiographySchema = new mongoose.Schema({

        firstName : {
            type : String,
            require :true,
            trim : true
        },
        lastName:{
            type : String,
            require : true,
            trim : true
        },
        Email :{
            type:String,
            require : true,
            trim: true,
            unique:true,
            lowercase : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw  Error("Not a valid Email")
                }
            }
        },
        Password:{
            type:String,
            require:true,
            validate(value){
                if(value.length < 8 ){
                    throw  Error("Password Length must be atleast 8 characters")
                }
            }
        },

        confirmPassword:{
            type:String,
            require:true,
            validate(value){
                if(value.length < 8 ){
                    throw  Error("Password Length must be atleast 8 characters")
                }
            }
        },

        Address : {
            type:String,
            require:true,
        },

        Mobile : {
            type:String,
            require:true,
            trim:true
        },
        Country : {
            type:String,
            require:true,
            trim:true
        },

        tokens : [{
            token:{
                type :String,
                require :true
            }
        }
         ],

},{
    timestamps :true
})


//radiologist schema
const radiologistSchema = new mongoose.Schema({

    firstName : {
        type : String,
        require :true,
        trim : true
    },
    lastName:{
        type : String,
        require : true,
        trim : true
    },
    Email :{
        type:String,
        require : true,
        trim: true,
        unique:true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw  Error("Not a valid Email")
            }
        }
    },
    Password:{
        type:String,
        require:true,
        validate(value){
            if(value.length < 8 ){
                throw  Error("Password Length must be atleast 8 characters")
            }
        }
    },

    confirmPassword:{
        type:String,
        require:true,
        validate(value){
            if(value.length < 8 ){
                throw  Error("Password Length must be atleast 8 characters")
            }
        }
    },
    
    Address : {
        type:String,
        require:true,
    },

    Mobile : {
        type:String,
        require:true,
        trim:true
    },
    Country : {
        type:String,
        require:true,
        trim:true
    },

    tokens : [{
        token:{
            type :String,
            require :true
        }
    }
     ],

},{
timestamps :true
})


// Patient Schema 
const PatientSchema = new mongoose.Schema({

    Name : {
        type : String,
        require :true,
        trim : true
    },

    Email :{
        type:String,
        require : true,
        trim: true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw  Error("Not a valid Email")
            }
        }
    },

    Age : {
        type: String,
        require:true,
        trim:true,   
    },

   xray : {
        data: Buffer
   } ,

   Mobile :{
       type: String,
       require:true,
       trim:true
   },
    Date : {
        type: String,
        require: true,
        trim:true
    },

    radiographerName : {
        type : String,
        require :true,
        trim : true
    }



},{
timestamps :true
})


// End of Schema


radiographySchema.methods.generateAuthTokens = async function(){
    let user = this
    const token = jwt.sign({_id : user._id.toString()},'pneumoniaDetection')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

radiologistSchema.methods.generateAuthTokens = async function(){
    let user = this
    const token = jwt.sign({_id : user._id.toString()},'pneumoniaDetection')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

radiographySchema.statics.findByCredentials = async function(email,password){
        const user = await radiography.findOne({Email:email})
        console.log(user)
        if (!user){
            throw Error("User Not found")
        }

        if(password !== user.Password){
            throw Error("Incorrect Password")
        }
        return user
}

radiologistSchema.statics.findByCredentials = async function(email,password){
    const user = await radiologist.findOne({Email:email})
    console.log(user)
    if (!user){
        throw Error("User Not found")
    }

    if(password !== user.Password){
        throw Error("Incorrect Password")
    }
    return user
}

radiographySchema.pre('save',async function(next){
    let user = this
    if(user.isModified('Password')){

    }
    next()
})

radiologistSchema.pre('save',async function(next){
    let user = this
    if(user.isModified('Password')){

    }
    next()
})

const radiography = mongoose.model('Radiography',radiographySchema)
const radiologist = mongoose.model('Radiologist',radiologistSchema)
const patient = mongoose.model('Patients',PatientSchema)

module.exports = {radiography,radiologist,patient}
