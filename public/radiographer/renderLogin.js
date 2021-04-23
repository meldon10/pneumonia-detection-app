

document.querySelector("#radiographerLogin").addEventListener('click',(event)=>{
    window.location.href="/radiographer/login"
    event.preventDefault()
})

document.querySelector("#radiologistLogin").addEventListener('click',(event)=>{
    window.location.href="/radiologist/login"
    event.preventDefault()
})

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


document.querySelector('#submit').addEventListener('click',(event)=>{
    var name = document.querySelector('#name')
    var email= document.querySelector('#email')
    var message = document.querySelector('#message')
    var number = document.querySelector('#number')
    if(name.value && message.value && email.value && number.value){
      flag = true
      if(!ValidateEmail(email.value)){
            flag=false
            document.querySelector('#errorEmail').innerHTML = `<p style="color: red;margin-bottom:2px;margin-top:1px;margin-left:3px;font-size:14px;">Invalid Email</p>`
         
      }
      if(!phonenumber(number.value) )
      {
            flag=false
            document.querySelector('#errorPhone').innerHTML = `<p style="color: red;margin-bottom:2px;margin-top:1px;margin-left:3px;font-size:14px;">Invalid Number</p>`
            
      }

      if(flag===true){
        data = {
            "Name" : name.value,
            "Email":email.value,
            "Message":message.value,
            "Number" : number.value
        }
    
        fetch(`/Contact/Query`,{
            method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data),
        
        }).then((response)=>{
            if (response.status === 200){
            
               name.value=""
               email.value=""
               message.value=""
               number.value=""
               document.querySelector("#compusory").innerHTML =``
               window.alert("Message Sent successfully");
            }else{
               // SET ERROR MESSAGE FOR INVALID PASSWORD
              
            }
    
        
        })
      }
    }
    else{
        document.querySelector("#compusory").innerHTML=`<p style="color: red;margin-left:3px;font-size:14px;">*Please fill in all the fields</p>`
    }
    

    event.preventDefault()
})