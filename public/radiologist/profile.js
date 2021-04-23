var fname = document.querySelector("#fname")
var lname = document.querySelector("#lname")
var email = document.querySelector("#email")
var password = document.querySelector("#password")
var address = document.querySelector("#address")
var mobile = document.querySelector("#mobile")
var country = document.querySelector("#country")


const togglePassword = document.querySelector('#togglePassword');
togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

function ValidateEmail(mail) 
{
 if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(mail))
  {
    document.querySelector('#errorEmail').innerHTML = ``
    return (true)
    
  }
  
    return (false)
}

function phonenumber(number)
{
  var phoneno = /^\d{10}$/;
  if((number.match(phoneno)))
{     
      document.querySelector('#errorPhone').innerHTML = ``
      return true;
      }
      else
        {
      
        return false;
        }
}

function passwordValidate(password){
     
     if(!(password.length >= 8)){
            return "length error"
     }
     document.querySelector("#errorPassword").innerHTML =``
     return true
}


var radiologistName=document.querySelector("#radiologistName")

const token = window.location.href.split("=")[1]
bearer='Bearer '+token
fetch(`/Radiologist/Account/profile`,{
    method : 'GET',
    headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json',
    }

 }).then((response)=>{
        // Add Error Handler
        response.json().then((data)=>{
         
            fname.value = data.fname,
            lname.value = data.lname,
            email.value = data.email,
            password.value = data.password,
            address.value =data.address,
            country.value =data.country,
            mobile.value = data.mobile
            
            radiologistName.innerHTML = `<strong style="font-family: Arial;color:#4f6ecc">RADIOLOGIST</strong><br>${data.fname}&nbsp;${data.lname}`
        })
 })

 document.querySelector('#saveSettings').addEventListener('click',(event)=>{

    if(fname.value && lname.value && email.value && password.value && address.value && mobile.value && country.value)
    {
        flag = true
        if(!ValidateEmail(email.value)){
              flag=false
              document.querySelector('#errorEmail').innerHTML = `<p style="color: red;margin-bottom:2px;margin-top:2px;margin-left:3px;font-size:14px;">Invalid Email</p>`
           
        }
        if(!phonenumber(mobile.value) )
        {
              flag=false
              document.querySelector('#errorPhone').innerHTML = `<p style="color: red;margin-bottom:2px;margin-top:2px;margin-left:3px;font-size:14px;">Invalid Number</p>`
              
        }
        
        output = passwordValidate(password.value)
        if(output !== true){
             
              if(output === "length error"){
                    flag=false
                    document.querySelector("#errorPassword").innerHTML =`<p style="color: red;margin-bottom:2px;margin-top:2px;margin-left:5px;font-size:14px;">Password must be 8 characters long</p>`
                    
              }
              if(output === true){
                    document.querySelector("#errorPassword").innerHTML =``
              }
        }

        if(flag===true){
            const userToken = window.location.href.split("=")[1]
            bearer='Bearer '+userToken
            var radiologistData={
                "firstName":fname.value,
                "lastName":lname.value,
                "Email":email.value,
                "Password":password.value, 
                "Address" : address.value,
                "Mobile" : mobile.value,
                "Country" : country.value
            }
            fetch(`/Radiologist/Account/updateProfile`,{
            method : 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(radiologistData)
        
            }).then((response)=>{
                if(response.status == 200){
                   
                    document.querySelector('#compulsory').innerHTML=``
                    window.location.reload()
                }
            })
        }
  
    }
    else{
        document.querySelector('#compulsory').innerHTML= `<p style="color: red;margin-bottom:2px;margin-top:2px;">*Please fill in all the fields</p>`
    }

   
    

    event.preventDefault()
 })



 document.querySelector('#patientRecords').addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]

    window.location.href=`/radiologist/Account/patient?token=${token}`
    event.preventDefault()
    
})


// document.querySelector('#newPatient').addEventListener('click',(event)=>{
//     const token = window.location.href.split("=")[1]

//     window.location.href=`/radiographer/Account/patient/newPatient?token=${token}`
//     event.preventDefault()
    
// })

document.querySelector('#logout').addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]
  
    bearer='Bearer '+token
    fetch(`/radiologist/Account/logout`,{
        method : 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'

        }

     }).then((response)=>{
         
         if(response.status ===200){
            window.location.href='/'
         }
     })
    
    event.preventDefault()
    
})