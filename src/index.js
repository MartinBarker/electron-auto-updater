$(document).keyup(function(e) {
    if (e.key === "Escape") { 
        if($('#uploadModal').is(':visible')){
           $('#uploadModal').modal('toggle');
        }
       
   }
});
$(document).ready(function () {
    
    /*
    $('#example').dataTable({
        "processing": true, // control the processing indicator.
        "serverSide": true, // recommended to use serverSide when data is more than 10000 rows for performance reasons
        "info": true,   // control table information display field
        "stateSave": true,  //restore table state on page reload,
        "lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],    // use the first inner array as the page length values and the second inner array as the displayed options
        "ajax":{
            "url": "@string.Format("{0}://{1}{2}", Request.Url.Scheme, Request.Url.Authority, Url.Content("~"))/Home/AjaxGetJsonData",
            "type": "GET"
        },
        "columns": [
            { "data": "Name", "orderable" : true },
            { "data": "Age", "orderable": false },
            { "data": "DoB", "orderable": true },
            {
                "render": function (data, type, JsonResultRow, meta) {
                    return '<img src="Content/'+JsonResultRow.ImageAddress+'">';
                }
            }
        ],
        "order": [[0, "asc"]]
    });
    */
});

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
        console.log('file = ', files[fileNum])
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

