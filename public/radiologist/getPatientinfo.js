
email = atob(window.location.href.split("=")[1])

var xray
var model
var image
var datajpg
var flag= false

let img = new Image();
function loadColorMapImage() {
  image = document.querySelector('#newImage')
 

 
  image.src =  datajpg;
  //console.log(image.src)  
   flag = true

   loadUserImage()
}

function viewColormap(){
  document.querySelector("#colormap").addEventListener('click',(event)=>{

 
    // document.querySelector(".myImage").src= datajpg
   
     var newCanvas=document.querySelector('#destCanvas')
     // console.log(newCanvas.toDataURL())
      var modal = document.getElementById('newModal');
   
      // Get the image and insert it inside the modal - use its "alt" text as a caption
      
      var modalImg = document.getElementById("img02");
      
      modal.style.display = "block";
      modalImg.src = newCanvas.toDataURL();
   
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
   
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
      modal.style.display = "none";
      }
   
   })
}

fetch(`/Radiologist/Account/getPatientInfo?email=${email}`,{
  method : 'GET',
  headers: {
      'Content-Type': 'application/json',
  },


  }).then((response)=>{
      if(response){
          response.json().then((data)=>{
             var userData = data.Data

             document.querySelector("#name").innerHTML=userData.Name
             document.querySelector("#email").innerHTML=userData.Email
             document.querySelector("#age").innerHTML=userData.Age
             document.querySelector("#mob").innerHTML=userData.Mobile
             document.querySelector("#date").innerHTML=userData.Date
             xray = userData.xray
             var output = arrayBufferToBase64(xray.data.data)
    
            datajpg = "data:image/jpg;base64," + output;
            // console.log(datajpg)
          //    loadImage(datajpg)
         
            loadColorMapImage()
          
         

          })
      }
  })


async function initialize() {
    model = await tf.loadLayersModel('https://imn-pneumonia-detection-tool.herokuapp.com/tfjs-models/model.json');
   
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
}



// document.querySelector("#test").addEventListener('change',(event)=>{
   
    
//     img = document.querySelector("#test")
    
//     reader = new FileReader()
//     reader.readAsDataURL(img.files[0])
//     reader.onload = function(){
//         console.log(reader.results)
//         //loadImage(reader.results)
//     }
    
// })

document.querySelector("#viewXray").addEventListener("click",(event)=>{
    var output = arrayBufferToBase64(xray.data.data)
    
   var datajpg = "data:image/jpg;base64," + output;
  // document.querySelector(".myImage").src= datajpg

  
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    
    var modalImg = document.getElementById("img01");
    
    modal.style.display = "block";
  
    //datajpg
    modalImg.src = datajpg;
   
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
    

})


document.querySelector('#model').addEventListener('click', async (event)=>{

    // fetch(`/Radiologist/Account/getModel`,{
    //     method : 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    
    
    //     }).then((response)=>{
    //         if(response){
    //            response.json().then(async (data)=>{
    //                console.log(data)
    //                model = await tf.loadLayersModel(data)

    //            })
    //         }
    //     })

   
      
       // model = await tf.loadLayersModel("http://localhost:3000/tfjs-models/model.json");
       

 
        //CODE
        //img = document.querySelector('#test')
       
      
        
            // reader = new FileReader()
           
            // reader.readAsDataURL(img.files[0])
            // reader.onload = function() {
            //     //console.log(reader.result);
            //     document.querySelector('#newImage').src = reader.result
            //  };
      
    
        // console.log(img.files)
        // reader = new FileReader()
        //  reader.readAsDataURL(img.files[0])
       
        
        //END

        let tensor = tf.browser.fromPixels(image)
       
        // tensor.print()
        //tf.browser.fromPixels(image).print()
       

        const resized = tf.image.resizeBilinear(tensor, [64, 64]).toFloat()
        
        const offset = tf.scalar(255);
        
        const normalized  = resized.sub(offset).div(offset);

        const batched = normalized.expandDims()
        
        let predictions = await model.predict(batched).data();
       
        
        if(predictions[0] < 0.7){
       
            document.querySelector("#modelResult").innerHTML = `<td><strong style="color:#4f6ecc;font-size:20px;">RESULT</strong></td><td style="color:#4c53b4; font-size:17px;"><strong>Normal</strong></td>`
            document.querySelector("#resultColorMap").innerHTML =`<td><strong style="color:#4f6ecc;font-size:20px;">COLORMAP</strong></td><td ><button class="btn btn-primary" id="colormap" type="button">View Colormap Image of X-ray</button></td>`
            document.querySelector("#patientReport").innerHTML =`<button style="margin-top: 15px; margin-left:136px;" class="btn btn-primary" id="" type="button">Send Report To Patient</button>`
            document.querySelector("#dataTable").style.border="2px solid rgb(64, 106, 223)"
            viewColormap()
          
            document.querySelector("#patientReport").addEventListener('click',(event)=>{

              fetch(`/Radiologist/Account/sendPatientInfo?email=${email}&result=Normal`,{
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
              
              
                }).then((response)=>{
                    if(response.status === 200){
                    
                          alert("Mail Sent Successfully")
                       
              
                     
                    }
                })
            })
        }else{

          document.querySelector("#modelResult").innerHTML = `<td><strong style="color:#4f6ecc;font-size:20px;">RESULT</strong></td><td style="color:red; font-size:17px;"><strong>Pneumonia Detected</strong></td>`
          document.querySelector("#resultColorMap").innerHTML =`<td><strong style="color:#4f6ecc;font-size:20px;">COLORMAP</strong></td><td ><button class="btn btn-primary" id="colormap" type="button">View Colormap Image of X-ray</button></td>`
          document.querySelector("#patientReport").innerHTML =`<button style="margin-top: 15px; margin-left:136px;" class="btn btn-primary" id="" type="button">Send Report To Patient</button>`
          document.querySelector("#dataTable").style.border =  "2px solid rgb(64, 106, 223)"
          viewColormap()
         

          document.querySelector("#patientReport").addEventListener('click',(event)=>{

            fetch(`/Radiologist/Account/sendPatientInfo?email=${email}&result=Pneumonia`,{
              method : 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
            
            
              }).then((response)=>{
                  if(response.status===200){
                  
                      
                    alert("Mail Sent Successfully")
                     
            
                   
                  }
              })
          })
        }

        
    event.preventDefault()
})




//New CODE

  let tWidth;
  let blur;
  let srcChannel;
  
/* end of values from user interface */

  let goodImage = false;

  let dimx, dimy; // dimensions of target image
  let destCtx;
  let srcData;

/* canvas for color map */
  let ctxMap;
  let hMap, wMap;
  let x0Ruler, x1Ruler; // left & right position of rulers in color map
  let yRuler1; // top position 
  const hRuler = 20; // width of ruler
  const colorResol = 1024; // resolution of color map
  let tbMap; // table for color mapping
  let tbMap2; // tbMap 'exploded' in 'colorResol' levels
  let tbMap3; // == tbMap2, with separate r,g,b
  let nStop = 0; // number of current selected stop in UI

/* shortcuts for Math */

  const mrandom = Math.random;
  const mfloor = Math.floor;
  const mround = Math.round;
  const mceil = Math.ceil;
  const mabs = Math.abs;
  const mmin = Math.min;
  const mmax = Math.max;

  const mPI = Math.PI;
  const mPIS2 = Math.PI / 2;
  const m2PI = Math.PI * 2;
  const msin = Math.sin;
  const mcos = Math.cos;
  const matan2 = Math.atan2;
  const mexp = Math.exp;

  const mhypot = Math.hypot;
  const msqrt = Math.sqrt;

//-----------------------------------------------------------------------------
// miscellaneous functions
//-----------------------------------------------------------------------------

  function alea (min, max) {
// random number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') return min * mrandom();
    return min + (max - min) * mrandom();
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function intAlea (min, max) {
// random integer number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  } // intAlea

//-----------------------------------------------------------------------------
/* rgbToHsl and hslToRgb : code from stackOverflow */

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){ // this function copied from somewhere on Stack Overflow

    r /= 255, g /= 255, b /= 255;
    var max = mmax(r, g, b), min = mmin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
} // function rgbToHsl

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [mround(r * 255), mround(g * 255), mround(b * 255)];
} // function hslToRgb

//------------------------------------------------------------------------------
function toHex2(number) {
  var s = number.toString(16).toUpperCase();
  return (((s.length)<2) ?'0':'')+s;
} // toHex2
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function rgbToCssString(arRgb) {
  return '#' + toHex2(mround(arRgb[0]))+
               toHex2(mround(arRgb[1]))+
               toHex2(mround(arRgb[2]));
} // rgbToCssString
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function cssStringToRgb (str) {
  return [parseInt ('0x' + str.substring(1,3), 16),
          parseInt ('0x' + str.substring(3,5), 16),
          parseInt ('0x' + str.substring(5,7), 16)];
} // cssStringToRgb

//--------------------------------------------------------------------
function lerp (x, x0, x1, y0, y1) {
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)
} // lerp

//--------------------------------------------------------------------
function Interpolator (x0, x1, color0, color1) {
/* returns a function for color interpolation
supposed to make a smart choice between hsl and rgb interpolation
- x0 and x1 are numeric values. The returned function is supposed to be
called later with a parameter between x0 and x1
- color0 and color1 are given in [r, g, b] arrays format. The returned function
will return a value with the same format.
*/

  let [r0, g0, b0] = color0;
  let [r1, g1, b1] = color1;
  let [h0, s0, l0] = rgbToHsl (r0, g0, b0);
  let [h1, s1, l1] = rgbToHsl (r1, g1, b1);
  let h, s, l;

  let dx = x1 - x0;

// if x interval too short, just return color1
  if (mabs(dx) < 0.001) return ()=> color1;

/* if hue is not very well defined (small saturation or too dark or too light)
at at least one end, interpolate in rgb
else interpolate in hsl
Threshold levels subject to change */
  if (s0 < 0.1 || s1 < 0.1 || l0 < 0.1 || l1 < 0.1 || l0 > 0.9 || l1 > 0.9) {
    return  x => {
      let dx0 = x - x0;
      let dx1 = x1 - x;
      return [(r0 * dx1 + r1 * dx0) / dx,
              (g0 * dx1 + g1 * dx0) / dx,
              (b0 * dx1 + b1 * dx0) / dx];
      };
  } // if rgb interpolation
/* hsl interpolation : find shorter path from h0 to h1 */

  if (h1 > h0 + 0.5) h0 += 1;
  if (h0 > h1 + 0.5) h1 += 1;
  // here, h0 and h1 may be greater than 1
  return  x => {
      let dx0 = x - x0;
      let dx1 = x1 - x;
      h = ((h0 * dx1 + h1 * dx0) / dx) % 1; // back to the 0-1 interval
      s = (s0 * dx1 + s1 * dx0) / dx;
      l = (l0 * dx1 + l1 * dx0) / dx;
      return hslToRgb(h, s, l);
    };
} // Interpolator
//--------------------------------------------------------------------

function createImage() {

  if (!goodImage) return; // no picture to work on

/* read user parameters */
  readUI();

  let srcCanvas = document.getElementById('reference');
  let srcCtx = srcCanvas.getContext ('2d');

  let destCanvas = document.getElementById('destCanvas');
  destCtx = destCanvas.getContext ('2d');

  const hSize = img.width; // original image
  const vSize = img.height;

  dimx = tWidth;
  dimy = mround(tWidth * img.height / img.width);

  srcCanvas.width = destCanvas.width = dimx
  srcCanvas.height = destCanvas.height = dimy;
  srcCtx.drawImage(img, 0, 0, dimx, dimy); // loaded image is resized and hidden

  destCtx.fillStyle = '#000';
  destCtx.fillRect (0, 0, dimx, dimy);

  srcData = srcCtx.getImageData(0, 0, dimx, dimy);

  filterImage();

} // function createImage

//--------------------------------------------------------------------

function filterImage() {

  let data = srcData.data;
  let kx, ky;
  let filtLine;
  let offs, offsy, pix;
  let nbpts;
  let acc;

  let filter = [function() { // filter red
             acc += data[offs]; // accumulate values
       },
       function() { // filter green
             acc += data[offs + 1]; // accumulate values
       },
       function() { // filter blue
             acc += data[offs + 2]; // accumulate values
       },
       function() { // filter lightness
             acc += 0.2126 * data[offs] +
                    0.7152 * data[offs + 1] +
                    0.0722 * data[offs + 2]; // accumulate values
       }][srcChannel];

  let filtered = [];
  let ly = 4 * dimx; // length of 1 line (in bytes in 'data')
  let offsky = 0;
  for (ky = 0 ; ky < dimy; ++ky) {

    filtLine = filtered[ky] = [];
    for (kx = 0 ; kx < dimx; ++kx) {
      nbpts = 0;
      acc = 0;
      offsy = offsky - blur * ly; // offset in 'data'
      for (let y = -blur; y <= blur ; ++y) {

        if (offsy < 0) { offsy += ly; continue;}
        if (ky + y >= dimy) break;
        offs = offsy + 4 * (kx - blur);
        for (let x =  kx - blur; x <= kx + blur ; ++x) {
          if (x < 0) {offs += 4; continue; }
          if (x >= dimx) break;
          filter();         // accumulate values
          nbpts++;           // count real points
          offs += 4;         // point to next point
        } // for x
        offsy += ly;
      } // for y
      filtLine[kx] = mround(acc / nbpts / 255 * 1023); // 0..1023
    } // for kx
    offsky += ly;
  } // for ky

  let nData = destCtx.createImageData(srcData);
  offs = 0;
  for (ky = 0 ; ky < dimy; ++ky) {

    filtLine = filtered[ky];
    for (kx = 0 ; kx < dimx; ++kx) {
      pix = tbMap3[filtLine[kx]];
      nData.data[offs] = pix[0];   // r
      nData.data[offs+1] = pix[1]; // g
      nData.data[offs+2] = pix[2]; // b
      nData.data[offs+3] = 255;    // opacity
      offs += 4;
    } // for kx
  } // for ky
  destCtx.putImageData(nData, 0, 0);
} // filterImage

//--------------------------------------------------------------------

function loaded() {
  
  goodImage = true;
  createImage();
} // loaded

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// function loadImage(number) {
//   goodImage = false;
//   img.src = [woman_600_800,
//              stairs_800_600
//             ][number - 1];
// } // loadImage

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function loadUserImage() {
  newimg = document.querySelector('#newImage')
  // console.log(newimg)
  img.src =newimg.src
  
  // console.log(img.src)
  // loaded()
  // let inp = document.getElementById('userfile');
//   inp.onchange = function() {
// // check a few points
//     if (this.files.length < 1) {
//       callBackKO();
//       return;
//     }
//     let file = this.files[0];

//     if (file.type.substr(0,6) != 'image/'){
//       callBackKO();
//       return;
//     }

//     if (file.size < 1) {
//       callBackKO();
//       return;
//     }

//     let reader = new FileReader();
//     reader.onload = function(e) {
//             img.src = e.target.result;
//             callBackOK();
//             return;
//           };

//     reader.readAsDataURL(file);
//    } // inp.onchange

//   inp.click(); // click hidden button, open control to load file

//   function callBackOK() {
//     loaded();
//   }
//   function callBackKO() {
//     displayError('Could not load file');
//   }
} // loadUserImage

//--------------------------------------------------------------------

function readUI() {
// read user interface - except color map

 getTWidth();
 getBlur();
 getChannel();

} // readUI

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getTWidth() {

// target width
  let ctrl = document.getElementById('tWidth');
  let x = parseInt(ctrl.value, 10);
  if (isNaN (x)) { x = tWidth }
  if (x < 200) x = 200;
  if (x > 2000) x = 2000;
  ctrl.value = tWidth = x;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getBlur() {

// blur
  let ctrl = document.getElementById('blur');
  let x = parseInt(ctrl.value, 10);
  if (isNaN (x)) { x = blur }
  if (x < 0) x = 0;
  if (x > 5) x = 5;
  ctrl.value = blur = x;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getChannel() {

// Channel
  let ctrl = document.getElementById('srcChannel');
  srcChannel = parseInt(ctrl.value, 10); // always good value - I hope so
}

//--------------------------------------------------------------------

function displayError(message) {
  // let msg = document.getElementById('msg');
  // msg.innerHTML = message;
  // setTimeout(function(){msg.innerHTML = '&nbsp;'},2000);
} // displayError

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function drawRuler1 () {

  ctxMap.clearRect(x0Ruler, yRuler1, x1Ruler - x0Ruler, hRuler);
  ctxMap.lineWidth = 2;
  for (let k = 0; k < (x1Ruler - x0Ruler); ++k) {
    ctxMap.beginPath();
    ctxMap.moveTo (x0Ruler + k, yRuler1);
    ctxMap.lineTo (x0Ruler + k, yRuler1 + hRuler);
    ctxMap.strokeStyle = tbMap2[mround(k * colorResol / (x1Ruler - x0Ruler) )];
    ctxMap.stroke();
  } // for k
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function explodeTbMap () {

/* re-orders the points of tbMap by level
   pre-computes the (colorResol) shades to use for final drawing */

  let level0, color0;
  let level1, color1;
  let level;
  let interp, rInterp;
  let ky = 0;

  tbMap.sort((vala, valb) => {
      if (vala.level < valb.level) return -1;
      if (vala.level > valb.level) return 1;
      return 0;
    });

  tbMap2 = [];
  tbMap3 = [];
  let p1 = tbMap[0];
  for (let k = 1 ; k < tbMap.length; ++k) {
    ({level: level0, color: color0} = p1);
    p1 = tbMap[k];
    ({level: level1, color:color1} = p1);
    interp = Interpolator (level0, level1, color0, color1);

    while (ky <= colorResol && (level = ky / colorResol) <= level1) {
      tbMap3[ky] = rInterp = interp(level);
      tbMap2[ky++] = rgbToCssString(rInterp);
    }  // while ky
  } // for k
  interp = null;
} //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function updateUIMap() {

/* updates user interface for mapping of colors BUT explodeTbMap and drawRuler1 */
  if (nStop < 0) nStop = 0;
  if (nStop >= tbMap.length) nStop = tbMap.length - 1;

  document.getElementById("nStop").innerHTML = nStop + 1; // humans begin to count at 1
   document.getElementById("nbStops").innerHTML = tbMap.length;
   document.getElementById("previous").style.visibility = ((nStop == 0) ? 'hidden' : 'visible');
   document.getElementById("next").style.visibility = ((nStop >= tbMap.length - 1) ? 'hidden' : 'visible');
   document.getElementById("insert").style.visibility = ((nStop >= tbMap.length - 1) ? 'hidden' : 'visible');
 document.getElementById("delete").style.visibility = ((nStop == 0 || nStop >= tbMap.length - 1) ? 'hidden' : 'visible');
  if (nStop == 0 || nStop >= tbMap.length - 1) {
    document.getElementById("position").setAttribute("disabled","");
  } else {
    document.getElementById("position").removeAttribute("disabled");
  }
  document.getElementById("position").value = tbMap[nStop].level;
  document.getElementById("color").value = rgbToCssString(tbMap[nStop].color);

// draw triangle to display current stop

  ctxMap.clearRect(x0Ruler - 5 , yRuler1 + hRuler + 1 , x1Ruler - x0Ruler + 10, 12);
  let x = x0Ruler + (x1Ruler - x0Ruler) * tbMap[nStop].level;
  ctxMap.beginPath();
  ctxMap.fillStyle = '#FFFFFF';
  ctxMap.moveTo (x, yRuler1 + hRuler + 2);
  ctxMap.lineTo (x + 4, yRuler1 + hRuler + 2 + 10);
  ctxMap.lineTo (x - 4, yRuler1 + hRuler + 2 + 10);
  ctxMap.fill();


} //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function incNStop() {
  ++nStop;
  updateUIMap();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function decNStop() {
  --nStop;
  updateUIMap();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function changePosition() {

  let vs;

  if (nStop == 0 || nStop >= tbMap.length - 1) return; // should not happen

  let curStop = tbMap[nStop];
  let curV = curStop.level;

  let v = Number.parseFloat (this.value);
  if (Number.isNaN(v)) v = tbMap[nStop].level;

  if (v <= 0.0001) v = 0.0001;
  if (v >= 0.9999) v = 0.9999;

  vs = v.toFixed(4);          // string representation
  v = Number.parseFloat(vs);  // adjust value to representation

  this.value = v;    // update display to exact retained value

  if (curV == v) return; // no real change

  curStop.level = v; // update position in map
  explodeTbMap();       // re-order stops and explode tbMap
// nStop may have changed
  nStop = tbMap.findIndex(elem => (elem==curStop));
  updateUIMap();
  drawRuler1();

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function changeColor() {

  tbMap[nStop].color = cssStringToRgb(this.value);
  explodeTbMap();       // re-order stops and explode tbMap
  drawRuler1();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function insertStop() {
  if (nStop >= tbMap.length - 1) return; // should not happen
  let {level: lev0, color: color0 } = tbMap[nStop];
  let {level: lev1, color: color1 } = tbMap[nStop + 1];
  let newStop = {};
  newStop.level = (lev0 + lev1) / 2
  newStop.level = Number.parseFloat(newStop.level.toFixed(4));
  let interp = Interpolator (lev0, lev1, color0, color1);
  newStop.color = interp(newStop.level);
  tbMap.splice(++nStop, 0, newStop);

  explodeTbMap();
  updateUIMap();
  drawRuler1();

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function deleteStop() {

  if (nStop == 0 || nStop >= tbMap.length - 1) return; // should not happen

  tbMap.splice(nStop, 1);
  --nStop;
  explodeTbMap();
  updateUIMap();
  drawRuler1();

}

//--------------------------------------------------------------------

// beginning of execution

 
  img.crossOrigin = "Anonymous";
  img.addEventListener('load', loaded);
  img.addEventListener('error', function() {
    displayError ("unable to load picture");
    goodImage = false;});

 document.getElementById('drawButton').addEventListener ('click', createImage);
  //  document.getElementById('loadButton1').addEventListener ('click', function() {loadImage(1);});
  //  document.getElementById('loadButton2').addEventListener ('click', function() {loadImage(2);});
  // document.getElementById('newImage').addEventListener ('change', loadUserImage);
   document.getElementById('tWidth').addEventListener ('change', getTWidth);
   document.getElementById('blur').addEventListener ('change', getBlur);
   document.getElementById('srcChannel').addEventListener ('change', getChannel);

/* UI
/* initialize color map rules */

  ctxMap = document.getElementById('cMap').getContext('2d');
  hMap = hRuler + 30 ;
  ctxMap.canvas.height = hMap;
  wMap = ctxMap.canvas.width;

  yRuler1 = 10;
  x0Ruler = 10;
  x1Ruler = wMap - x0Ruler;

  // initial color map : shades of green
  // 1st point MUST have level 0 and last point MUST have level 1
  tbMap = [{level: 0, color: [0, 0, 0]},
           {level: 0.25, color: [0, 0, 255]},
           {level: 0.5, color: [255, 128, 0]},
           {level: 0.85, color: [255, 255, 0]},
           {level: 0.86, color: [0, 0, 0]},
           {level: 1, color: [0, 0, 0]}];
  explodeTbMap();
  drawRuler1();
  updateUIMap();

  document.getElementById("previous").addEventListener('click', decNStop);
  document.getElementById("next").addEventListener('click', incNStop);
  document.getElementById("position").addEventListener('change', changePosition);
  document.getElementById("color").addEventListener('change', changeColor);
  document.getElementById("insert").addEventListener('click', insertStop);
  document.getElementById("delete").addEventListener('click', deleteStop);




  /* values from user interface */
 
  
    // loadImage(1);
  

//END


initialize()