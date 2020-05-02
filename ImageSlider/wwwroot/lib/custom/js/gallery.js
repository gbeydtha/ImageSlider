
$(function () {
    console.log("gallery.js loaded ");
    loadGallerySelect();

    viewgallery();
});

// Code for Tabulator Table
// We will add the tabular code
var table = new Tabulator("#LoadGalleryTable", {
    height: "800px",
    layout: "fitColumns",
    paginationSize: 20,
    placeholder: "No Data Set",
    columns: [
        { title: "Id", field: "galleryId", sorter: "number", width: 10 },
        { title: "Title", field: "title", sorter: "string" },
        { title: "Active", field: "isActive", align: "center", formatter: "tickCross", sorter: "boolean" },
        { title: "Featured", field: "isFeatured", align: "center", formatter: "tickCross", sorter: "boolean" },
        {
            title: "Created", field: "timeCreated", sorter: "date", align: "center", formatter: function (cell) {
                var convertTime = new Date(cell.getValue()).toUTCString();
                return convertTime;
            }
        },
        {
            title: "Updated", field: "lastUpdated", sorter: "date", align: "center", formatter: function (cell) {
                var connvertTime = new Date(cell.getValue()).toUTCString();
                return connvertTime;
            }
        },
        { title: "Username", field: "username", sorter: "string", align: "center" },
        { title: "Type", field: "galleryType", sorter: "string", align: "center" },
        {
            title: "Actions", sortable: false, align: "center", formatter: function (cell) {
                var galId = cell.getData().galleryId;
                var galTitle = cell.getData().title;
                var active = cell.getData().isActive;
                var featured = cell.getData().isFeatured;
                var created = cell.getData().timeCreated;
                var lastUpdated = cell.getData().lastUpdated;
                var username = cell.getData().username;
                var gallerytype = cell.getData().galleryType;
                var newEditRow = "<div class='btn-group' role='group' aria-label='Perform Actions'>" +
                    "<button type='button' name='preview' class='btn btn-success btn-sm' onclick='loadModalslider(this)' " +
                    " data-editid='" + galId + "' " +
                    ">" +
                    "<span>" +
                    "<i class='fa fa-eye'>" +
                    "</i>" +
                    "</span>" +
                    "</button>" +
                    "<button type='button' name='Edit'  class='btn btn-primary btn-sm' onclick='editGalleryById(this)' " +
                    " data-editid='" + galId + "' " +
                    " data-title='" + galTitle + "' " +
                    " data-active='" + active + "' " +
                    " data-featured='" + featured + "' " +
                    " data-created='" + created + "' " +
                    " data-lastupdated='" + lastUpdated + "' " +
                    " data-username='" + username + "' " +
                    " data-gallerytype='" + gallerytype + "' " +
                    ">" +
                    "<span>" +
                    "<i class='fa fa-edit'>" +
                    "</i>" +
                    "</span>" +
                    "</button>" +
                    "<button type='button' name='Delete' data-delid='" + galId + "'  class='btn btn-danger btn-sm' onclick='deleteGalleryById(this)' " +
                    ">" +
                    "<span>" +
                    "<i class='fa fa-trash'>" +
                    "</i>" +
                    "</span>" +
                    "</button>" +
                    "</div>"

                return newEditRow;

            }
        }
    ]
});

//var table = new Tabulator("#LoadGalleryTable", {

//    height: "800px",
//    layout: "fitColumns",
//    paginationSize: 20,
//    placeholder: "No dataset",
//    columns: [
//        { title: "Id", field: "galleryId", sorter: "number", width: 10 },
//        { title: "Title", field: "title", sorter: "string" },
//        { title: "Active", field: "isActive", align: "center", formatter: "tickCross", sorter: "boolean" },
//        { title: "Featured", field: "isFeatured", align: "center", formatter: "tickCross", sorter: "boolean" },
//        { title: "Created", field: "timeCreated", align: "center", sorter: "date", formatter: function (cell) {
//                var convertTime = new Date(cell.getValue()).toUTCString(); 
//                return convertTime;
//        }},
//        { title: "Updated", field: "lastUpdated", align: "center",  sorter: "date", formatter: function (cell) {
//            var convertTime = new Date(cell.getValue()).toUTCString();
//            return convertTime;
//        }},
//        { title: "UserName", field: "username", sorter: "string", align: "center" },
//        { title: "Type", field: "galleryType", sorter: "string", align: "center" },
//        { title: "Actions", sortable: false, align: "center", formatter: function (cell) {
//                var galId = cell.getData().galleryId;
//                var galTitle = cell.getData().title;
//                var active = cell.getData().isActive;
//                var featured = cell.getData().isFeatured;
//                var created = cell.getData().timeCreated;
//                var lastupdated = cell.getData().lastUpdated;
//                var username = cell.getData().username;
//            var gallerytype = cell.getData().galleryType;

//            var newEditRow = "<div class='btn-group' role='group' aria-label='Perform Actions'>" + 
//                "<button type='button' name='preview' class='btn btn-success btn-sm' onclick='loadModalSlider(this)' data-editid='" + galId + "' >" +
//                "<span> <i class='fa fa-eye'>" +
//                "</i>" +
//                "</span>" +
//                "</button>" +
//                "<button type='button' name='Edit' class=' btn btn-primary btn-sm' onclick='editGalleryById(this)' " +
//                "data-editid='" + galId+"' " +
//                "data-title='" + galTitle +"' " +
//                "data-active='" + active +"' " +
//                "data-featured='" + featured +"' " +
//                "data-created='" + created +"' " +
//                "data-lastupdated='" +  lastupdated +"' " +
//                "data-username='" + username + "' " +
//                "data-gallerytype='" + gallerytype + "' " +
//                ">" +
//                "<span>" +
//                "<i class='fa fa-edit'>" +
//                "</i>" +
//                "</span>" +
//                "</button>" +
//                "<button type='button' name='Delete' data-editid='" + galId + "' class='btn btn-danger btn-sm' onclick='deleteGalleryById(this)' > " +
//                "<span>" +
//                "<i class='fa fa-trash'>" +
//                "</i>" +
//                "</span>" +
//                "</button>" +
//                "</div>"

//            return newEditRow; 
//            }},
//    ]
//}); 

// function to create modal carousel
function loadModalslider(val) {
    var editId = $(val).data('editid');

    $("#PreviewGalleryModalBody").html("");
    $("#PreviewGalleryModalById").modal('show');


    var counter = 0;
    $.ajax({
        type: 'GET',
        url: '/api/Gallery/GetImageGalleryById/' + editId,
        dataType: 'json',
        success: function (data) {
            $('#PreviewGalleryModalBody').append("<ol class='carousel-indicators'></ol>");
            $('#PreviewGalleryModalBody').append("<div class='carousel-inner'></div>");
            $('#PreviewGalleryModalBody').append("<a class='carousel-control-prev' href='#PreviewGalleryModalBody' role='button' data-slide='prev'></a>");
            $('.carousel-control-prev').append("<span class='carousel-control-prev-icon' aria-hidden='true'></span>");
            $('.carousel-control-prev').append("<span class='sr-only'>Previous</span>");
            $('#PreviewGalleryModalBody').append("<a class='carousel-control-next' href='#PreviewGalleryModalBody' role='button' data-slide='next'></a>");
            $('.carousel-control-next').append("<span class='carousel-control-next-icon' aria-hidden='true'></span>");
            $('.carousel-control-next').append("<span class='sr-only'>Next</span>");

            $.each(data, function (key, value) {
                $('.carousel-indicators').append("<li data-target='#PreviewGalleryModalBody' data-slide-to='" + counter + "'  class='" + (counter == 0 ? "slideIndicators active" : "slideIndicators") + "'></li>");
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
//function loadModalSlider(val) {

//    var editId = $(val).data('editid');
//    console.log(editId);
//    $("#PreviewGalleryModalBody").html("");
//    $("#PreviewGalleryModalBody").modal("show");

//    var counter = 0; 
//    $.ajax({

//        type: 'GET',
//        url: '/api/Gallery/GetImageGalleryById/' + editId,
//        dataType: 'json',
//        success: function (data) {

//            $('#PreviewGalleryModalBody').append("<ol class='carousel-indicators'></ol>");
//            $('#PreviewGalleryModalBody').append("<div class='carousel-inner'></div>");

//            $('#PreviewGalleryModalBody').append("<a class='carousel-control-prev' href='#PreviewGalleryModalBody' role='button' data-slide='prev'></a>");
//            $('.carousel-control-prev').append("<span class='carousel-control-prev-icon' aria-hidden='true'></span>");
//            $('.carousel-control-prev').append("<span class='sr-only'>Previous</span>");

//            $('#PreviewGalleryModalBody').append("<a class='carousel-control-next' href='#PreviewGalleryModalBody' role='button' data-slide='next'></a>");
//            $('.carousel-control-next').append("<span class='carousel-control-next-icon' aria-hidden='true'></span>");
//            $('.carousel-control-next').append("<span class='sr-only'>Next</span>");

//            $.each(data, function (key, value) {

//                $('.carousel-indicators').append("<li data-target='#PreviewGalleryModalBody' data-slide-to='" + counter + "'  class='" + (counter == 0 ? "slideIndicators active" : "slideIndicators") + "'></li>");
//                $('.carousel-inner').append("<div class='" + (counter == 0 ? "carousel-item active" : "carousel-item") + "'>" +
//                    "<img class='d-block w-100' alt='" + value.image_AltText + "' src='" + value.image_Path + "' />" +
//                    "<div class='carousel-caption d-none d-md-block'>" +
//                    "<h5>" + value.image_Caption + "</h5>" +
//                    "<p>" + value.image_Description + "</p>" +
//                    "</div>" +
//                    "</div>"
//                );
//                counter++;
//                console.log(value);

//            });
//        }
//    });
//}

// method to Edit gallery - gallery level
function editGalleryById(value) {
    // Initialize values - so previous values are cleared
    $("#featuredbyId").attr('checked', false);
    $("#activebyId").attr('checked', false);

    // Get all values from the row 
    var editId = $(value).data('editid');
    var title = $(value).data('title');
    var active = $(value).data('active');
    var featured = $(value).data('featured');
    var lastUpdated = $(value).data('lastupdated');
    var created = $(value).data('created');
    var username = $(value).data('username');
    var gallerytype = $(value).data('gallerytype');
    console.log(active);

    $("#EditGalleryModalById").modal('show');
    $("#EditGalleryModalById .modal-title").html("Edit Gallery : " + editId);
    $("#EditGalleryModalById #galleryById").text(editId);
    $("#GalleryTitleEditById").val(title);
    $("#datecreated").val(created);
    $("#dateupdated").val(lastUpdated);
    if (active) {
        $('#activebyId').prop('checked', true);
    }
    else {
        $("#activebyId").prop('checked', false);
    }

    if (featured) {
        $("#featuredbyId").prop('checked', true);
    }
    else {
        $("#featuredbyId").prop('checked', false);
    }


    $("#username").val(username);
    $("#GalleryTypeEditById").val(gallerytype);
}
// Method to Edit the Gallery 
//function editGalleryById(value) {

//    $("#activebyId").attr('checked', false);
//    $("#featuredId").attr('checked', false);

//    // get all the values from the row.
//    var editId = $(value).data('editid');
//    var title = $(value).data('title');
//    var active = $(value).data('active');
//    var featured = $(value).data('featured');
//    var lastupdated = $(value).data('lastupdated');
//    var created = $(value).data('created');
//    var username = $(value).data('username');
//    var gallerytype = $(value).data('gallerytype');
//    console.log(title); 

//    $("#PreviewGalleryModalById").modal('show');
//    $("#PreviewGalleryModalById .modal-title").html("Edit Gallery :") + editId; 
//    $("#PreviewGalleryModalById #galleryById").text(editId); 
//    $("#GalleryTitleEditById").val(title);
//    $("#datecreated").val(created);
//    $("#dateupdated").val(lastupdated);

//    if (active) {
//        $("#activebyid").prop('checked', true);
//    }
//    else {
//        $("#activebyid").prop('checked', false);
//    }

//    if (featured) {
//        $("#featuredbyId").prop('checked', true);
//    }
//    else {
//        $("#featuredbyId").prop('checked', false);
//    }

//    $("#username").val(username);
//    $("#GalleryTypeEditById").val(gallerytype);
//}


function AjaxUpdateGalleryById(formData) {
    var form_Data = new FormData(formData);
    var id = $('#EditGalleryModalById #galleryById').text();


    var ajaxOptions =
    {
        type: 'PUT',
        url: '/api/Gallery/UpdateGalleryById/' + id,
        data: form_Data,
        success: function (result) {
            $('#EditGalleryModalById').modal('hide');
            $('#EditGalleryModalById').trigger("reset");
            loadGallerySelect();
            viewgallery();



            // alert("Gallery Updated Successfully");
        },
        error: function () {
            alert("Could Not Update Gallery");
        }
    }

    ajaxOptions["contentType"] = false;
    ajaxOptions["processData"] = false;

    $.ajax(ajaxOptions);

    return false;

}

//function AjaxUpdateGalleryById(formData)
//{
//    var form_data = new formData(formData);
//    var id = $("#EditGalleryModalById #galleryById").text(id);
//    var ajaxOption = {

//        type: 'PUT',
//        url: '/api/Gallery/UpdateGalleryById/' + id,
//        data: form_Data,
//        success: function (result) {
//            $("#EditGalleryModalById").modal('hide');
//            $("#EditGalleryModalById").trigger("reset");
//            loadGallerySelect();
//            viewgallery(); 

//            console.log('Galelry Edit success');
//        },
//        error: function () {
//            alert("Could not update Gallery");
//        }
//    }
//    ajaxOption["contentType"] = false;
//    ajaxOption["processeData"] = false;

//    $.ajax(ajaxOption);
//    return false;
//}


function viewgallery() {

    $.ajax({
        type: 'GET',
        url: '/api/Gallery/GetImageGallery/',
        dataType: 'json',
        success: function (data) {
            var obj = JSON.stringify(data); 
            table.setData(obj);
        }
    });
}

// Method to delete the Gallery

function deleteGalleryById(value) {
    var delId = $(value).data('delid');
    
    $("#DeleteGalleryModal").modal('show');
    $("#DeleteGalleryModal .modal-title").html("Delete Confirmation");
    $("#DeleteGalleryModal .modal-body").html("Do You Want To Delete " + "<strong class='text-danger'><span id='toDeleteGallery'>" + delId + "</span></strong>" + " Gallery ? ");

}


//function deleteGalleryById(value) {

//    var delId = $(value).data('editid');
//    $("#DeleteGalleryModal").modal('show');
//    $("#DeleteGalleryModal .modal-title").html("Delete confirmation");
//    $("#DeleteGalleryModal .modal-body").html("Do you want to Delete " + "<strong class='text-danger'> <span id='toDeleteGallery'>" + delId + "</span> </strong>" + "  Gallery ?");
//}


////////////////////////////// required Properties //////////////////////////////////////////
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
        "</tr>";

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
            alert("Gallery created Successfully");
            console.log(result);
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
            $("#EditGalleryTable").append("<tbody></tbody>");

            $.each(data, function (key, value) {
                console.log(value); 
                $("#EditGalleryTable tbody").append(BuildEditRow(value));
            });
        }
    });

}

// create dynamic row for each Image
function BuildEditRow(value) {

    console.log(value.image_Description);
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
            "<input name='ImageTitle[]' class='form-control col-xs-3' value='" + value.image_Title +"' placeholder='Title' " +
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

//Open the file explorer

function openFileExplorer(item) {

    $(item).closest("tr").find("input[type='file']").trigger('click');
}


// Preview the upload image  

function previewImg(input) {

    var parent_Element = $(input).closest("tr");
    
    if (input.files && input.files[0]) {

        var reader = new FileReader(); 
        reader.onload = function (e) {

            $(parent_Element).find('img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// ***************** Update images in Gallery *************************************** 

var GalleryObjects = [];

GalleryObjects[0] = []; // Will store all the image IDs
GalleryObjects[1] = [];
GalleryObjects[2] = []; // Will store all the image Captions
GalleryObjects[3] = []; // Will store all the image Descriptions
GalleryObjects[4] = []; // Will store all the image AltTexts

function AjaxUpdateGallery(formData) {

    var form_Data = new FormData(formData); 

    var ids = form_Data.getAll('Image_Id[]');
    var title = form_Data.getAll('ImageTitle[]');
    var captions = form_Data.getAll('ImageCaption[]'); 
    var descriptions = form_Data.getAll('Description[]');
    var altText = form_Data.getAll('AltText[]');

    for (var counter = 0; counter < ids.length; counter++) {

        GalleryObjects[0].push(ids[counter]);
        GalleryObjects[1].push(title[counter]);
        GalleryObjects[2].push(captions[counter]);
        GalleryObjects[3].push(descriptions[counter]);
        GalleryObjects[4].push(altText[counter]);
    }

    for (var i = 0, imageId, imageTitle, imageCaption, imageDescription, imageAltText;
        imageId = GalleryObjects[0][i],
        imageTitle = GalleryObjects[1][i],
        imageCaption = GalleryObjects[2][i],
        imageDescription = GalleryObjects[3][i],
        imageAltText = GalleryObjects[4][i];
        i++) {

            form_Data.append('imageId[]', imageId); 
            form_Data.delete('Image_Id[]');

            form_Data.append('imageTitle[]', imageTitle);
            form_Data.delete('ImageTitle[]');

            form_Data.append('imageCaption[]', imageCaption);
            form_Data.delete('ImageCaption[]');

            form_Data.append('description[]', imageDescription);
            form_Data.delete('Description[]');

            form_Data.append('altText[]', altText);
            form_Data.delete('AltText[]');
    }

    var galleryId = $("#EditGalleryModal #galleryId").text(); 

    console.log("GalleryId : " + galleryId); 
    var ajaxOptions = {

        type: 'PUT',
        url: '/api/Gallery/UpdateGallery/' + galleryId,
        data: form_Data,
        success: function (result) {

            alert("Gallery Updated Successfully");
            window.location.href = "/Home/Index";
        },
        error: function () {
            alert("Could not Update Gallery");
        }
    };

    if ($(formData).attr('enctype') == "multipart/form-data") {

        ajaxOptions["contentType"] = false;  
        ajaxOptions["processData"] = false; 
    }

    $.ajax(ajaxOptions); 

    return false; 
}

// ******************** delete image Gallery**********************************************

function deletegallery() {

    var id = $("#selectImageGallery").val();
    $("#DeleteGalleryModal").modal('show');
    $("#DeleteGalleryModal .modal-title").html("Delete Confirmation");
    $("#DeleteGalleryModal .modal-body").html("Do you want to Delete " + "<strong class='text-danger'> <span id='toDeleteGallery'>" +id + "</span> </strong>" + "  Gallery ?");
}



         
function confirmDeleteGallery()
{

    var idGallery = $("#toDeleteGallery").text();
    var ajaxOptions = {};
    ajaxOptions.type = "DELETE"; 
    ajaxOptions.url = "/api/Gallery/DeleteGallery/" + idGallery;
    ajaxOptions.dataType = "json";
    ajaxOptions.success = function ()
    {
        $("#DeleteGalleryModal").modal('hide');

        alert("Deleted Gallery");
        loadGallerySelect();
        viewgallery();
    };
    ajaxOptions.error = function () {

        alert("Coud not Delete Gallery")
    };

    $.ajax(ajaxOptions);
}

