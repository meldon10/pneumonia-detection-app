const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


togglePassword.addEventListener('click', function (e) {
      const password = document.querySelector('#loginPassword')
      const togglePassword = document.querySelector('#togglePassword');
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

//Login
document.querySelector('#loginButton').addEventListener('click',(event)=>{
    
    var email = document.querySelector('#loginID')
    var password = document.querySelector('#loginPassword')
    
    data = {
        "Email" : email.value,
        "Password" : password.value
    }
   
    fetch(`/Radiologist/signin/login`,{
        method : 'POST',
    headers: {
        'Content-Type' : 'application/json'
    },
    body : JSON.stringify(data),
    
    }).then((response)=>{
        if (response.status === 200){
        
            response.json().then((data)=>{
        
                if(data.token){
                    window.location.href = `/radiologist/Account?token=${data.token}`
                }
                
            })
             
        }else{
           // SET ERROR MESSAGE FOR INVALID PASSWORD
           document.querySelector('#userError').innerHTML=`<p style="color: red;font-size:12px">Invaild username or password</p>`
        }

    
    })
    
    
    event.preventDefault()
})

//END



//Register 


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

document.querySelector('#submitDetails').addEventListener('click',(event)=>{
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
            document.querySelector('#errorEmail').innerHTML =  `<p style="color: red;margin-right: 260px;margin-top:2px;font-size:12px">Invalid Email</p>`
         
      }
      if(!phonenumber(mobile.value) )
      {
            flag=false
            document.querySelector('#errorPhone').innerHTML = `<p style="color: red;margin-right: 190px;margin-top:2px;font-size:12px">Invalid Contact Number</p>`
            
      }
      
      output = passwordValidate(password.value)
      if(output !== true){
           
            if(output === "length error"){
                  flag=false
                  document.querySelector("#errorPassword").innerHTML =`<p style="color: red;margin-right: 135px;margin-left:20px;margin-top:5px; font-size:12px">Password must be 8 characters long</p>`
                  
            }
            if(output === true){
                  document.querySelector("#errorPassword").innerHTML =``
            }
      }
      
      if(!checkPassword(password.value, confPassword.value)){
            flag=false
            document.querySelector("#errorconfPassword").innerHTML =`<p style="color: red;margin-right:108px;margin-left:20px;margin-top:5px; font-size:12px">Please make sure your passwords match</p>`
      
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
  
  
//END