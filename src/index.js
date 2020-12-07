
let dropArea = document.getElementById('newUploadFilesInput');
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})
function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})
function highlight(e) {
    dropArea.classList.add('highlight')
}
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})
function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

//handle files drop event
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
    handleFiles(files)
    //([...files]).forEach(previewFile)
}

function handleFiles(files) {
    console.log('handleFiles() ', files)
    for (var fileNum = 0; fileNum < files.length; fileNum++ ) {
        console.log('fileNum=', fileNum)
        console.log('files[fileNum]=', files[fileNum])
        document.getElementById('newUploadFilesDisplay').innerHTML = 
        `
        ${document.getElementById('newUploadFilesDisplay').innerHTML} 
        <br> 
        ${files[fileNum].name}
        `;
      }

}

$('#uploadModal').on('hidden.bs.modal', function (e) {
    document.getElementById('newUploadFilesDisplay').innerHTML = "";
  })

/*
function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
        let img = document.createElement('img')
        img.src = reader.result
        document.getElementById('gallery').appendChild(img)
    }
}
*/

