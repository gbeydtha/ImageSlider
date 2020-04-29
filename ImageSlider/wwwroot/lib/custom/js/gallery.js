﻿
$(function () {
    console.log("gallery.js loaded ");
    loadGallerySelect();

});


// required Properties 

// This array will contain all the objects received from the form submission
var FormObjects = [];

// Will Contain an array of all image files
FormObjects[0] = [];

// Will Contain an array of all Image Captions files
FormObjects[1] = [];

function PreviewFiles() {
    // First get all the selected files and store them in the variable.
    var files = document.querySelector('input[type=file]').files;

    // nested function - Will be used to read the selected files.
    function readAndPreview(file) {
        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            // This is as class that is available under HTML5
            var reader = new FileReader();

            // Listen for the load evernt to be triggered
            reader.addEventListener("load", function () {
                // Create an new image object using the IMage Class and set the image properties
                // We want set certain properies before we display the preview to the user.
                var image = new Image(200, 200);
                image.title = file.name;
                image.border = 2;
                image.src = this.result;
                // lets add this new Image to the table row (basically create an dynamic row)
                addImageRow(image);
                // count the number of Images selected
                countTableRow();
                // Finally Append the files to an array. We want to send this array to Server
                FormObjects[0].push(file);

            }, false);

            //The readAsDataURL method is used to read the contents of the specified Blob or File. 
            // When the read operation is finished, the readyState becomes DONE, and the loadend is triggered. 
            reader.readAsDataURL(file);
        }
    }

    // Now check if the files are selected and we have atleaset one file (in thte files variable)
    if (files && files[0]) {
        [].forEach.call(files, readAndPreview);
    }

    //  finally set the value of the file selector to null. That's because, if you try to select same file without browser refresh, you cannot do it.
    $('input[type="file"]').val(null);

}


function addImageRow(image) {

    // First check if the <tbody> tag already exists, if not add one 
    if ($("#ImageUploadTable tbody").length == 0) {
        $("#ImageUploadTable").append("<tbody></tbody>");
    }

    // Now Lets append row to the table
    $("#ImageUploadTable tbody").append(BuildImageTableRow(image)); // We will use extension method to do that.
}


// Function to Create new Row for each Image selected to upload 
function BuildImageTableRow(image) {
    var newRow = "<tr>" +
        "<td>" +
        "<div class=''>" +
        "<img name='photo[]' style='border:1px solid' width='100' height='50' class='image-tag' src= '" + image.src + "' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<input name='ImageTitle[]' class='form-control col-xs-3' value='' placeholder='Title' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<input name='ImageCaption[]' class='form-control col-xs-3' value='' placeholder='Caption' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<input name='ImageAlt[]' class='form-control col-xs-3' value='' placeholder='Alt text' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<textarea name='ImageDescription[]' class='form-control col-xs-3' value='' placeholder='Description'>" +
        "</textarea> " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class='btn-group' role='group' aria-label='Perform Actions'>" +
        "<button type='button' name='Edit' class='btn btn-primary btn-sm' onclick='' " +
        ">" +
        "<span>" +
        "<i class='fa fa-edit'>" +
        "</i>" +
        "</span>" +
        "</button>" +
        "<button type='button' name='Delete' class='btn btn-danger btn-sm' onclick='removeFile(this)' " +
        ">" +
        "<span>" +
        "<i class='fa fa-trash'>" +
        "</i>" +
        "</span>" +
        "</button>" +
        "</div>" +
        "</td>" +
        "</tr>"

    return newRow;
}

// Method to count Table rows
// Count number of Files in the table

function countTableRow() {
    $("#imgCount").html("<i class='fa fa-images'></i> " + $("#ImageUploadTable tbody tr").length);
}

// Function to clear Preview table 

function clearPreview() {

    if ($("#ImageUploadTable tbody tr").length > 0) {
        $("#ImageUploadTable tbody tr").remove(); 
        $("#imgCount").html("<i class='fa fa-images'> </i>" + 0);
    }
}


function removeFile(item) {

    // Current Clicked Row
    var row = $(item).closest('tr');

    if ($("#ImageUploadTable tbody tr").length > 1) {
        FormObjects[0].splice(row.index(), 1);
        //FormObjects[1].splice(row.index(), 1);

        row.remove();
        countTableRow();
    }
    else if ($("#ImageUploadTable tbody tr").length == 1) {
        $("#ImageUploadTable tbody").remove(); 
        FormObjects[0] = [];
        //FormObjects[1] = [];
        countTableRow(); 
    }
}


// Method to create Featured Gallery
function AjaxPost(formdata) {

    var form_Data = new FormData(formdata);

    for (var i = 0, file; file = FormObjects[0][i]; i++) {
        form_Data.append('Files[]', file); 
        form_Data.delete('Files');
    }

    for (var j = 0, caption; caption = FormObjects[1][j]; j++) {
        form_Data.append('ImageCaption[]', caption);
        form_Data.delete('ImageCaption');
    }

    var ajaxOptions = {
        type: "POST",
        url: "/api/Gallery/CreateNewGallery/",
        data: form_Data, 
        success: function (result) {
            alert(result);
           // window.location.href= "/Home/Index"
        }
    }

    if ($(formdata).attr('enctype') == "multipart/form-data") {
        ajaxOptions['contentType'] = false;
        ajaxOptions['processData'] = false;
    }

    $.ajax(ajaxOptions);
    return false;
}

//*********************************** Edit************************************

function editgallery() {

    var id = $("#selectImageGallery").val();
    $("#EditGalleryModal").modal('show'); 
    $("#EditGalleryModal .modal-title").html("Edit Gallery : " + id);
    $("#EditGalleryModal #galleryId").text(id);
    $.ajax({

        type: 'GET',
        url: '/api/Gallery/GetImageGalleryById/' + id,
        dataType: 'json',
        success: function (data) {

            $("#GalleryTitleEdit").val(data[0].gallery_Title);

            $("#EditGalleryTable tbody").remove(); 
            $("EditGalleryTable").append("<tbody></tbody>");

            $.each(data, function (key, value) {

                $("#EditGalleryTable tbody").append(BuildEditRow(value));
            });
        }
    });

}

// create dynamic row for each Image
function BuildEditRow(value) {

    console.log(value.image_Description);

         var newEditRow =
        "<tr>" +
        "<td>" +
        "<div class=''>" +
        "<input name='Image_Id[]' hidden class='form-control col-xs-3' value='" + value.image_Id + "' " +
        "/ > " +
        "<img name='photo[]' style='border:1px solid' width='100' height='50' class='image-tag' src= '" + value.image_Path + "' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<input name='ImageCaption[]' class='form-control col-xs-3' value='" + value.image_Caption + "' placeholder='Enter Image Caption' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<textarea name='Description[]' class='form-control col-xs-3'  placeholder='Enter Image Description'>" + value.image_Description + " " +
        "</textarea > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class=''>" +
        "<input name='AltText[]' class='form-control col-xs-3' value='" + value.image_AltText + "' placeholder='Enter Alt Text' " +
        "/ > " +
        "</div>" +
        "</td>" +
        "<td>" +
        "<div class='btn-group' role='group' aria-label='Perform Actions'>" +
        "<input type='file' name='File[]' style='display:none' onchange='previewImg(this)' " +
        "/>" +
        "<button type='button' name='Upload' class='btn btn-success btn-sm' onclick='openFileExplorer(this)' " +
        ">" +
        "<span>" +
        "<i class='fa fa-upload'>" +
        "</i>" +
        "</span>" +
        "</button>" +
        "</div>" +
        "</td>" +
        "</tr>"; 

        //"<tr>" +
        //    "<td>" +
        //    "<div class=''>" +
        //    "<input name='Image_Id[]' hidden class='form-control col-xs-3' value='" + value.image_Id + "' " +
        //    "/ > " +
        //    "<img name='photo[]' style='border:1px solid' width='100' height='50' class='image-tag' src= '" + value.image_Path + "' " +
        //    "/ > " +
        //    "</div>" +
        //    "</td>" +
        //    "<td>" +
        //    "<div class=''>" +
        //    "<input name='ImageCaption[]' class='form-control col-xs-3' value='" + value.image_Caption + "' placeholder='Enter Image Caption' " +
        //    "/ > " +
        //    "</div>" +
        //    "</td>" +
        //    "<td>" +
        //    "<div class=''>" +
        //    "<textarea name='Description[]' class='form-control col-xs-3'  placeholder='Enter Image Description'>" + value.image_Description + " " +
        //    "</textarea > " +
        //    "</div>" +
        //    "</td>" +
        //    "<td>" +
        //    "<div class=''>" +
        //    "<input name='AltText[]' class='form-control col-xs-3' value='" + value.image_AltText + "' placeholder='Enter Alt Text' " +
        //    "/ > " +
        //    "</div>" +
        //    "</td>" +
        //    "<td>" +
        //    "<div class='btn-group' role='group' aria-label='Perform Actions'>" +
        //    "<input type='file' name='File[]' style='display:none' onchange='previewImg(this)' " +
        //    "/>" +
        //    "<button type='button' name='Upload' class='btn btn-success btn-sm' onclick='openFileExplorer(this)' " +
        //    ">" +
        //    "<span>" +
        //    "<i class='fa fa-upload'>" +
        //    "</i>" +
        //    "</span>" +
        //    "</button>" +
        //    "</div>" +
        //    "</td>" +   

        //"</tr>";

    console.log(newEditRow); 
    return newEditRow; 
}


// Add Ajax method to call Gallery API

function loadGallerySelect() {

    //call the API
    $.ajax({

        type: 'GET',
        url: '/api/Gallery/GetImageGallery',
        data: 'json',
        success: function (result) {

            loadGalleries(result);
        },
        error: function () {
            alert("Could not load the Galleries");
        }
    });
}

function loadGalleries(result) {

    if (result != null) {

        $("#selectImageGallery").find('option').remove().end();
        $("#selectImageGallery").append("<option selected> Select Gallery </option>");

        for (i in result) {

            $("#selectImageGallery").append("<option value='" + result[i].galleryId + "'>" + result[i].title + "</option>");
        }
    }
}

// function to create preview of selected slider

function loadSlider(val) {
    var counter = 0;
    $.ajax({
        type: 'GET',
        url: '/api/Gallery/GetImageGalleryById/' + val,
        dataType: 'json',
        success: function (data) {
            $("#previewCarousel").html("");
            $('#previewCarousel').append("<ol class='carousel-indicators'></ol>");
            $('#previewCarousel').append("<div class='carousel-inner'></div>");
            $('#previewCarousel').append("<a class='carousel-control-prev' href='#previewCarousel' role='button' data-slide='prev'></a>");
            $('.carousel-control-prev').append("<span class='carousel-control-prev-icon' aria-hidden='true'></span>");
            $('.carousel-control-prev').append("<span class='sr-only'>Previous</span>");
            $('#previewCarousel').append("<a class='carousel-control-next' href='#previewCarousel' role='button' data-slide='next'></a>");
            $('.carousel-control-next').append("<span class='carousel-control-next-icon' aria-hidden='true'></span>");
            $('.carousel-control-next').append("<span class='sr-only'>Next</span>");
            $.each(data, function (key, value) {
                $('.carousel-indicators').append("<li data-target='#previewCarousel' data-slide-to='" + counter + "'  class='" + (counter == 0 ? "slideIndicators active" : "slideIndicators") + "'></li>");
                $('.carousel-inner').append("<div class='" + (counter == 0 ? "carousel-item active" : "carousel-item") + "'>" +
                    "<img class='d-block w-100' alt='" + value.image_AltText + "' src='" + value.image_Path + "' />" +
                    "<div class='carousel-caption d-none d-md-block'>" +
                    "<h5>" + value.image_Caption + "</h5>" +
                    "<p>" + value.image_Description + "</p>" +
                    "</div>" +
                    "</div>"
                );
                counter++;
                console.log(value);
            });


        }
    });
}

//function loadSlider(val) {
    
//    var counter = 0; 

//    $.ajax({

//        type: 'GET',
//        url: '/api/Gallery/GetImageGalleryById' + val, 
//        dataType: 'json',
//        success: function (data) {

//            $("#previewCarousel").html("");
//            $("#previewCarousel").append("<ol class='carousel-indicators'> </ol>");
//            $("#previewCarousel").append("<div class='carousel-inner'> </div>");
//            $("#previewCarousel").append("<a class='carousel-control-prev' href='#previewCarousel' role='button' data-slide='prev'>");
//            $(".carousel-control-prev").append("<span class='carousel-control-prev-icon' aria-hidden='true'></span>"); 
//            $(".carousel-control-prev").append("<span class='sr-only'>Previous</span>");
//            $("#previewCarousel").append("<a class='carousel-control-next' href='#previewCarousel' role='button' data-slide='next'>");
//            $(".carousel-control-next").append("<span class='carousel-control-next-icon' aria-hidden='true'></span>");
//            $(".carousel-control-next").append("<span class='sr-only'>Next</span>");
//            $.each(data, function (key, value) {

//                $(".carousel-indicators").append("<li data-target='#previewCarousel' data-slide-to='" + counter + "' class='" + (counter == 0 ? "slideIndicators active" : "slideIndicators") + "'></li>"); 
//                $(".carousel-inner").append("<div class='" + (counter == 0 ? "carousel-item active" : "carousel-item") + "'>" +
//                    "<img class='d-block w-100' src='" + value.image_Path +"' alt='" + value.image_AltText+"'/>" +
//                    "<div class='carousel-caption d-none d-md-block'> " +
//                    "<h5>" + value.image_Caption + "</h5>" +
//                    "<p>" + value.image_Description + "</p>" +
//                    " </div>" +
//                    " </div>");

//                counter++;
//                console.log(value); 
//            });
//        }

//    });
//}