
var patientRecords = []

radiographerName = document.querySelector('#username')
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
          
            
            radiographerName.innerHTML = `<i class="fas fa-user-circle"></i>&nbsp;&nbsp;<strong>${data.fname}&nbsp;${data.lname}</strong>`
        })
 })

function displayImage(){
   
  var patients =  document.querySelectorAll('.patientImage')
    for(var i =0 ;i<patients.length;i++){
        patients[i].addEventListener('click',(event)=>{
            var email = event.target.parentNode.children[1].innerText
     
            fetch(`/Radiologist/Account/getPatientImage?email=${email}`,{
                method : 'GET',
                headers: {
                'Content-Type' : 'application/json'
                }
              
            
            }).then((response)=>{
                if(response){
                   
                    
                    response.json().then((serverResponse)=>{
                        
                        var output = arrayBufferToBase64(serverResponse.Data.data)
                
                       var datajpg = "data:image/jpg;base64," + output;
                      // document.querySelector(".myImage").src= datajpg
        
                      
                        var modal = document.getElementById('myModal');
        
        // Get the image and insert it inside the modal - use its "alt" text as a caption
                        var img = document.querySelector('.patientImage');
                        var modalImg = document.getElementById("img01");
                        var captionText = document.getElementById("caption");
                        
                        modal.style.display = "block";
                        modalImg.src = datajpg;
                       
                        
                           
                        
        
                        // Get the <span> element that closes the modal
                        var span = document.getElementsByClassName("close")[0];
        
                        // When the user clicks on <span> (x), close the modal
                        span.onclick = function() {
                        modal.style.display = "none";
                        }
                    
        
                    })
                }
            })
            event.preventDefault()
        })
    }
    
    

}
 

fetch(`/Radiologist/Account/getPatient`,{
    method : 'GET',
    headers: {
    'Content-Type' : 'application/json'
    }

}).then((response)=>{
    response.json().then((data)=>{
        
        patientRecords = data["data"]
        
        for(var i=0;i<patientRecords.length;i++){
           
            var element = document.querySelector(".records");
            html = '<tr id="patientRecord-%id%"><td class="patientImage">%Name%</td><td>%Email%</td><td>%Mob%</td><td>%Age%</td><td>%Date%</td><td><button class="btn"><strong>Upload</strong></button></td></tr>'
            newHtml = html.replace("%id%",i+1);
            newHtml = newHtml.replace("%Name%",patientRecords[i]["Name"])
            newHtml = newHtml.replace("%Email%",patientRecords[i]["Email"])
            newHtml = newHtml.replace("%Mob%",patientRecords[i]["Mobile"])
            newHtml = newHtml.replace("%Age%",patientRecords[i]["Age"])
            newHtml = newHtml.replace("%Date%",patientRecords[i]["Date"])

            element.insertAdjacentHTML('beforeend',newHtml);
            patientRecords[i]["id"]=i+1;
        }
      
        displayImage()
   })


})

//delete patient
document.querySelector(".records").addEventListener("click",(event)=>{
    var temp
    var id = event.target.parentNode.parentNode.id
    var index = id.split("-")
   
    if(index[0] === "patientRecord" && parseInt(index[1]) >= 0)
      {  
       

        patientRecords.forEach((ele)=>{
            if(parseInt(ele.id) === parseInt(index[1])){
                temp= ele
               
            }
            
        })

        temp =JSON.stringify(temp.Email)
        temp = btoa(temp)
       
        window.open(`/radiologist/Account/patient/uploadPatient?record=${temp}`)
   
    }


})

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
}






document.querySelector("#userProfile").addEventListener('click',(event)=>{
    const token = window.location.href.split("=")[1]

    window.location.href=`/radiologist/Account?token=${token}`
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