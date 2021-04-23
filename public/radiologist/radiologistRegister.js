
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

function checkPassword(password,conPassword){
      if(password === conPassword){
            document.querySelector("#errorconfPassword").innerHTML =``
            return true
      }
      return false
}

document.querySelector('#radiologistRegister').addEventListener('click',(event)=>{
      var firstName = document.querySelector("#firstName")
      var lastName =document.querySelector("#lastName")
      var email = document.querySelector("#email")
      var password = document.querySelector("#password")
      var confPassword = document.querySelector("#conPassword")
      var address =  document.querySelector("#address")
      var mobile =  document.querySelector("#mobileNumber")
      var country = document.querySelector("#country")
  
if(firstName.value && lastName.value && email.value && password.value && confPassword.value && address.value && mobile.value && country.value){
      flag = true
      if(!ValidateEmail(email.value)){
            flag=false
            document.querySelector('#errorEmail').innerHTML = `<p style="color: red; margin-left: 20px; margin-top:5px;font-size:12px">Invalid Email</p>`
         
      }
      if(!phonenumber(mobile.value) )
      {
            flag=false
            document.querySelector('#errorPhone').innerHTML = `<p style="color: red; margin-left: 20px; margin-top:5px;font-size:12px">Invalid Contact Number</p>`
            
      }
      
      output = passwordValidate(password.value)
      if(output !== true){
           
            if(output === "length error"){
                  flag=false
                  document.querySelector("#errorPassword").innerHTML =`<p style="color: red;margin-left:20px;margin-top:5px; font-size:12px">Password must be 8 characters long</p>`
                  
            }
            if(output === true){
                  document.querySelector("#errorPassword").innerHTML =``
            }
      }
      
      if(!checkPassword(password.value, confPassword.value)){
            flag=false
            document.querySelector("#errorconfPassword").innerHTML =`<p style="color: red;margin-left:20px;margin-top:5px; font-size:12px">Please make sure your passwords match</p>`
      
      }

      if(flag===true){
            var radiologistData={
                  "firstName":firstName.value,
                  "lastName":lastName.value,
                  "Email":email.value,
                  "Password":password.value,
                  "confirmPassword" : confPassword.value,
                  "Address" : address.value,
                  "Mobile" : mobile.value,
                  "Country" : country.value
              }
           
             
              fetch(`/Radiologist/accountDetails`,{
                      method : 'POST',
                      headers: {
                            'Content-Type' : 'application/json'
                      },
                      body : JSON.stringify(radiologistData)
                }).then((response)=>{
                      
                      if(response.status === 201){
                     
                      firstName.value=""
                      lastName.value=""
                      email.value=""
                      password.value=""
                      confPassword.value=""
                      address.value=""
                      country.value=""
                      mobile.value=""
                      window.location.href="/radiologist/login"
                      
                      }else{
                      
                      
                      }
                      
          })

      }

      
  }
   
      
        
  
       event.preventDefault()
  })
  
  