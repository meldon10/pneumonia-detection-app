const express = require('express')
const router = express.Router()
const schema =require('../models/user')
const Radiographer = schema["radiography"]
const Radiologist = schema["radiologist"]
const Patient = schema["patient"]
const auth = require('../middleware/auth')
const radiologistAuth = require('../middleware/radiologistAuth')
const { json } = require('express')
var multer = require('multer');
const fs = require('fs')
const sgMail = require('@sendgrid/mail')




var storage = multer.diskStorage({
    destination: './public/users/',
    filename: function (req, file, cb) {
        switch (file.mimetype) {
            case 'image/jpeg':
                ext = '.jpeg';
                break;
            case 'image/png':
                ext = '.png';
                break;
        }
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});



router.post('/Radiographer/accountDetails', async (req,res)=>{
    
    const user = new Radiographer(req.body)
    

    try{
            await user.save()
            res.status(201).send(user)
    }catch(e){
          
            res.status(400).send()
         }
})

router.post('/Radiologist/accountDetails', async (req,res)=>{
    
    const user = new Radiologist(req.body)


    try{
            await user.save()
            res.status(201).send(user)
    }catch(e){
        
            res.status(400).send()
         }
})


// Adding New Patients 
router.post('/Radiographer/Account/addPatient',upload.single('xray') ,async (req,res)=>{
 
   var patientData = JSON.parse(req.body.myData)
   const img = fs.readFileSync(`./public/users/${req.file.filename}`)
   patientData['xray'] ={
       data : img
   }

   const user = new Patient(patientData)
    
    try{
           await user.save()
          
            res.status(201).send(user)
            fs.unlink('./public/users/'+req.file.filename,(err)=>{
                if(err){
                    console.log(err)
                }
            })
           
    }catch(e){
            
            res.status(400).send()
         }
})


//GET IMAGE
router.get('/Radiographer/Account/getPatientImage',async (req,res)=>{
    
    try {
        const user = await Patient.findOne({"Email" :req.query.email}) 
        
       
        res.send({"Data":user.xray.data})
        
    } catch (error) {
        console.error(error);
    }
  

})


// Get patients
router.get('/Radiographer/Account/getPatient', async (req,res)=>{

    try{
        const data = await Patient.find({},{"_id":0,"radiographerName":0})
        res.status(200).send({data})
    }catch(e){
        
            res.status(400).send()
         }
})

// Delete Patient
router.get('/Radiographer/Account/deletePatient', async (req,res)=>{
    data = JSON.parse(req.query.record)

    try {
       await Patient.findOneAndDelete({"Email":data})
       res.status(200).send()  
    }catch(e){
        
        res.status(400).send()
     }
    
})


//Radiographer Profile
router.get('/Radiographer/Account/profile',auth,async(req,res)=>{
       
        var data = {
            fname : req.user.firstName,
            lname : req.user.lastName,
            email : req.user.Email,
            password : req.user.Password,
            address : req.user.Address,
            mobile : req.user.Mobile,
            country :req.user.Country
        }
        res.send(data)
})


//Radiologist Profile
router.get('/Radiologist/Account/profile',radiologistAuth,async(req,res)=>{
  
    var data = {
        fname : req.user.firstName,
        lname : req.user.lastName,
        email : req.user.Email,
        password : req.user.Password,
        address : req.user.Address,
        mobile : req.user.Mobile,
        country :req.user.Country
    }
    res.send(data)
})

//radiologist update profile
router.post('/Radiologist/Account/updateProfile',radiologistAuth,async(req,res)=>{
    
 
    var data = req.body
    try{
        await Radiologist.findOneAndUpdate({"Email":req.user.Email},
        {"firstName":data.firstName,
         "lastName" : data.lastName,
         "Email":data.Email,
         "Password": data.Password,
         "confirmPassword":data.Password,
        "Address" : data.Address,
        "Mobile" : data.Mobile,
        "Country" : data.Country
        })
        res.status(200).send()
        }catch(e){
       res.status(400).send()
    }
    
})

//Radiologist Get patients
router.get('/Radiologist/Account/getPatient', async (req,res)=>{

    try{
        const data = await Patient.find({},{"_id":0,"radiographerName":0})
        res.status(200).send({data})
    }catch(e){
        
            res.status(400).send()
         }
})

//Radiologist Get patient image
router.get('/Radiologist/Account/getPatientImage',async (req,res)=>{
    
    try {
        const user = await Patient.findOne({"Email" :req.query.email}) 
        
     
        res.send({"Data":user.xray.data})
        
    } catch (error) {
        console.error(error);
    }
  

})


//Radiologist get patient info
router.get('/Radiologist/Account/getPatientInfo',async (req,res)=>{
   
   

    try {
        const user = await Patient.findOne({"Email" : JSON.parse(req.query.email)}) 
        res.send({"Data":user})
        
    } catch (error) {
        console.error(error);
    }
  

})




//radiographer update profile
router.post('/Radiographer/Account/updateProfile',auth,async(req,res)=>{
    
   
    var data = req.body
    try{
        await Radiographer.findOneAndUpdate({"Email":req.user.Email},
        {"firstName":data.firstName,
         "lastName" : data.lastName,
         "Email":data.Email,
         "Password": data.Password,
         "confirmPassword":data.Password,
        "Address" : data.Address,
        "Mobile" : data.Mobile,
        "Country" : data.Country
        })
        res.status(200).send()
        }catch(e){
       res.status(400).send()
    }
    
})



router.post('/Radiographer/signin/login',async (req,res)=>{
    try{
     
        const user = await Radiographer.findByCredentials(req.body.Email,req.body.Password)
        const token = await user.generateAuthTokens()
       
        res.status(200).send({user,token})
    }catch(e){
        res.status(404).send()
    }
    

})
//Radiographer Logout

router.get('/radiographer/Account/logout',auth,async (req,res)=>{
    try{
        
        const user =req.user
        user.tokens = []
        user.save()
        res.status(200).send()
    }catch(e){
        res.status(404).send()
    }
    

})


router.post('/Radiologist/signin/login',async (req,res)=>{
    try{
        
      
        const user = await Radiologist.findByCredentials(req.body.Email,req.body.Password)
     
        const token = await user.generateAuthTokens()
  
       
        res.status(200).send({user,token})
    }catch(e){
        res.status(404).send()
    }
    

})

//Radiologist Logout
router.get('/radiologist/Account/logout',radiologistAuth,async (req,res)=>{
    try{
        
        const user =req.user
        user.tokens = []
        user.save()
        res.status(200).send()
    }catch(e){
        res.status(404).send()
    }
    

})



router.get('/Radiologist/Account/getModel',async (req,res)=>{
    try{
         var model = fs.readFileSync('./public/tfjs-models/model.json')
         res.send(model)
       
    }catch(e){
    
    }
    

})

router.post('/Contact/Query',async(req,res)=>{
    try{
        
      
         const sendGridAPIKey = process.env.SENDGRID_API_KEY
          
        
        sgMail.setApiKey(sendGridAPIKey)
        
        sgMail.send({
            to : 'meldondcunha100@gmail.com',
            from : req.body.Email,
            subject : 'Query Regarding Pneumonia Detection Project',
            text : `${req.body.Name} with Contact Details ${req.body.Number} have following query -  ${req.body.Message}`
        })

        res.status(200).send()
    }
    catch(e){
        res.status(400).send()
    }
})







router.get('/Radiologist/Account/sendPatientInfo',async(req,res)=>{
    try{
       
    
        if(req.query.result==="Normal"){

            const user = await Patient.findOne({"Email" :JSON.parse(req.query.email)}) 
        
      
            var base64data = new Buffer.from(user.xray.data).toString('base64');
              fs.writeFileSync("./public/users/out.jpeg",base64data,"base64",function(err){
                  console.log(err)
              })
      
              var Imagedata = fs.readFileSync('./public/users/out.jpeg').toString('base64')
             
              const sendGridAPIKey = process.env.SENDGRID_API_KEY
                  
              sgMail.setApiKey(sendGridAPIKey)
              
              sgMail.send({
                  to : user.Email,
                  from : 'meldondcunha10@gmail.com',
                  subject : 'Pneumonia Detection Test Results',
                  
                  html:`<!DOCTYPE html>
                  <html>
                  <body>
                  
                  <h2 style="color:#0537ce;">Pneumonia Detection Test Results</h2>
                  <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 70%;">
                  
                    <tr>
                      <td style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Name</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Name}</td>
                    
                    </tr>
                    <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Email</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Email}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce">Contact Number</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Mobile}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Age</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Age}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Test Date</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Date}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Result</strong></td>
                      <td style="border: 2px solid #dddddd;text-align: left;padding: 8px;">Normal</td>
                    </tr>
                  
                  </table>
                  <h3 style="color:green; margin-top:20px; ">Please do consult your respective doctor once at your earliest convenience</h3>
                  </body>
                  </html>
                  `,
                  attachments: [{   // stream as an attachment
                      filename: "X-ray.jpeg",
                      path: "./public/users/out.jpeg",
                      contentType:  'image/jpeg',
                      content: Imagedata
                     
                  }]
                  
              })
              
              fs.unlink('./public/users/out.jpeg',(err)=>{
                  if(err){
                      console.log(err)
                  }
              })

        }else{
            const user = await Patient.findOne({"Email" :JSON.parse(req.query.email)}) 
        
      
            var base64data = new Buffer.from(user.xray.data).toString('base64');
              fs.writeFileSync("./public/users/out.jpeg",base64data,"base64",function(err){
                  console.log(err)
              })
      
              var Imagedata = fs.readFileSync('./public/users/out.jpeg').toString('base64')
             
              const sendGridAPIKey = process.env.SENDGRID_API_KEY
                  
              sgMail.setApiKey(sendGridAPIKey)
              
              sgMail.send({
                  to : user.Email,
                  from : 'meldondcunha10@gmail.com',
                  subject : 'Pneumonia Detection Test Results',
                  
                  html:`<!DOCTYPE html>
                  <html>
                  <body>
                  
                  <h2 style="color:#0537ce;">Pneumonia Detection Test Results</h2>
                  <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 70%;">
                  
                    <tr>
                      <td style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Name</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Name}</td>
                    
                    </tr>
                    <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Email</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Email}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce">Contact Number</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Mobile}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Age</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Age}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Test Date</strong></td>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;">${user.Date}</td>
                    </tr>
                     <tr>
                      <td  style="  border: 2px solid #dddddd;text-align: left;padding: 8px;"><strong style="color:#0537ce;">Result</strong></td>
                      <td style="color:red;border: 2px solid #dddddd;text-align: left;padding: 8px;">Pneumonai Detected</td>
                    </tr>
                  
                  </table>
                  <h3 style="color:red; margin-top:20px; ">Please consult your respective doctor at your earliest convenience</h3>
                  </body>
                  </html>
                  `,
                  attachments: [{   // stream as an attachment
                      filename: "X-ray.jpeg",
                      path: "./public/users/out.jpeg",
                      contentType:  'image/jpeg',
                      content: Imagedata
                     
                  }]
                  
              })
              
              fs.unlink('./public/users/out.jpeg',(err)=>{
                  if(err){
                      console.log(err)
                  }
              })
        }
      
        res.status(200).send()

    }catch(e){
            console.log(e)
    }  
   
})



module.exports = router