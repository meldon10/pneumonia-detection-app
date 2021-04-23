radiographerName = document.querySelector('#username')
const token = window.location.href.split("=")[1]
bearer='Bearer '+token
fetch(`/Radiographer/Account/profile`,{
    method : 'GET',
    headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json',
    }

 }).then((response)=>{
        // Add Error Handler
        response.json().then((data)=>{
            
            
            radiographerName.innerHTML = `<i class="fas fa-user-circle"></i>&nbsp;&nbsp;<strong>${data.fname}&nbsp;${data.lname}</strong>`
        })
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
 

document.querySelector('#submitDetails').addEventListener('click',(event)=>{
    event.preventDefault
    var name = document.querySelector("#patientName")
    var email = document.querySelector('#patientEmail')
    var age = document.querySelector('#patientAge')
    var mob = document.querySelector("#patientMob")
    var date = document.querySelector("#date")
    var radiographerName = document.querySelector("#radiographerName")
    var image = document.querySelector("#imageFile")
  

  
    // fetch(`/Radiographer/Account/addPatientImage`,{
    //     method : 'POST',
    //     body : formData,
        
    //     })
    
    if(name.value && email.value && age.value && mob.value && date.value && radiographerName.value && image.files[0])
    {   

      flag = true
      if(!ValidateEmail(email.value)){
            flag=false
            document.querySelector('#errorEmail').innerHTML =  `<p style="margin-left:5px;font-size:12px ;color:red; margin-bottom:2px;margin-top:2px">Invalid Email</p>`
         
      }
      if(!phonenumber(mob.value) )
      {
            flag=false
            document.querySelector('#errorPhone').innerHTML = `<p style="margin-left:5px; font-size:12px;color:red; margin-bottom:2px;margin-top:2px">Invalid Number</p>`
            
      }

      if(flag===true){
        data = {
            "Name" : name.value,
            "Email" : email.value,
            "Age" : age.value,
            "Mobile" : mob.value,
            "Date" : date.value,
            "radiographerName" : radiographerName.value
        }
        formData = new FormData()
        formData.append('xray',image.files[0])
        formData.append('myData',JSON.stringify(data))
        
        
        fetch(`/Radiographer/Account/addPatient`,{
            method : 'POST',
            body :formData
        
        }).then((response)=>{
            if (response.status === 201){
            
             
              name.value="" 
              email.value=""
              mob.value=""
              age.value=""
              date.value= ""
              radiographerName.value=""
              image.value=""
              document.querySelector("#compulsory").innerHTML=``
            

            }else{
               // SET ERROR MESSAGE FOR INVALID PASSWORD
            }
    
        
        })
      }

        

    }else{
        document.querySelector("#compulsory").innerHTML=`<p style="margin-left:60px; color:red; margin-bottom:2px;">*Please fill in all the fields to proceed.</p>`
    }
    event.preventDefault()
    
})

document.querySelector('#patientRecodrs').addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]

    window.location.href=`/radiographer/Account/patient?token=${token}`
    event.preventDefault()
    
})

document.querySelector("#userProfile").addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]

    window.location.href=`/radiographer/Account?token=${token}`
    event.preventDefault()
})



document.querySelector('#logout').addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]
  
    bearer='Bearer '+token
    fetch(`/radiographer/Account/logout`,{
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
