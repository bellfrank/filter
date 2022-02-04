// const image_input = document.querySelector("#image_input");
// var uploaded_image = "";
 
// image_input.addEventListener("change", function() {
//         const reader = new FileReader();
//         reader.addEventListener("load", () => {
//                 const uploaded_image = reader.result;
//                 document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
//         });
//         reader.readAsDataURL(this.files[0]);
// });


// Newest implementation
// const image_drop_area = document.querySelector("#image_drop_area");
// var uploaded_image;

// image_drop_area.addEventListener('dragover', (event) => {
//   event.stopPropagation();
//   event.preventDefault();
//   event.dataTransfer.dropEffect = 'copy';
// });

// once file is dropped, the variable fileList stores all the image data
// notice we use readImage to convert the image data into data URI
// image_drop_area.addEventListener('drop', (event) => {
//   event.stopPropagation();
//   event.preventDefault();
//   const fileList = event.dataTransfer.files;

//  readImage(fileList[0]);
// });

// readImage = (file) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', (event) => {
//    uploaded_image = event.target.result;     
// document.querySelector("#image_drop_area").style.backgroundImage     = `url(${uploaded_image})`;
//   });
//   reader.readAsDataURL(file);
// }



// // Drag and Drop for Image
function allowDrop(ev) {
  ev.preventDefault();
}

// must also give label on image with ID or else it won't work
function drag(ev) {
  var data = ev.dataTransfer.setData("text/plain", ev.target.id);
  console.log(data);
}

function drop(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);

  var source = document.querySelector(`#${data}`).getAttribute('src');
  console.log(source);

  ev.target.appendChild(myNewElement);

  ev.dataTransfer.clearData();
} 


// Drag and Drop For Site

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}


// // Old Implementation of Loading Image to Box

// const image_input = document.querySelector("#image_input");
// var uploaded_image = "";
 
// image_input.addEventListener("change", function() {
//         const reader = new FileReader();
//         reader.addEventListener("load", () => {
//                 const uploaded_image = reader.result;
//                 document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
//         });
//         reader.readAsDataURL(this.files[0]);
// });


// Try drag and drop implementation
let url = 'https://cdn.shopify.com/s/files/1/0234/8017/2591/products/young-man-in-bright-fashion_925x_f7029e2b-80f0-4a40-a87b-834b9a283c39.jpg'
const toDataURL = url => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
     }))


// ***Here is code for converting "Base64" to javascript "File Object".***

  function dataURLtoFile(dataurl, filename) {
     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
     while(n--){
     u8arr[n] = bstr.charCodeAt(n);
     }
   return new File([u8arr], filename, {type:mime});
  }


// *** Calling both function ***

  toDataURL(url)
  .then(dataUrl => {
     console.log('Here is Base64 Url', dataUrl)
     var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
     console.log("Here is JavaScript File Object",fileData)
     fileArr.push(fileData)
   })