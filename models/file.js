

//file:///android_asset/      applicationDirectory                            r       N/A     N/A     Yes
///data/data/<app-id>/        applicationStorageDirectory             -       r/w     N/A     N/A     Yes
//    cache                   cacheDirectory                      cache       r/w     Yes     Yes*    Yes
//    files                   dataDirectory                       files       r/w     Yes     No      Yes
//        Documents           documents                                       r/w     Yes     No      Yes
//<sdcard>/                   externalRootDirectory               sdcard      r/w     Yes     No      No
//    Android/data/<app-id>/  externalApplicationStorageDirectory     -       r/w     Yes     No      No
//        cache               externalCacheDirectory          cache-external  r/w     Yes     No**    No
//        files               externalDataDirectory           files-external  r/w     Yes     No      No


function LocalDirCreate(dirName) {

}

function localDirScan(dirName) {

}

function localFileDownload(url,filePath,success,error)
{
    log("going to download "+url+" and save to "+filePath);

    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);

    fileTransfer.download(
        uri,
        filePath,
        function(entry) {
            log("successfully download "+url+" to "+filePath);
            //log(entry);
            success(entry);
        },
        function(error) {
            log("download error"+url+" to "+filePath);
            log(error);
            error(error);
        },
        false,
        {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );

    return "Done";
}


function localFileWrite(filePath,text,append,localFileWriteSuccess,localFileWriteFailed) {
    log("going to write to local file: "+filePath);

    append = append || false;
    localFileWriteSuccess = localFileWriteSuccess || function(){};
    localFileWriteFailed = localFileWriteFailed || function(){};

    filePath = cordova.file.externalDataDirectory+filePath;
    var basePath = filePath.substring(0,filePath.lastIndexOf('/'));
    var fileName = filePath.substring(filePath.lastIndexOf('/')+1);

    window.resolveLocalFileSystemURL(basePath, function(dir) {
        dir.getFile(fileName, {create:true}, function(file) {
            if(!file){
                localFileWriteFailed();
                log("failed to write to local file: "+basePath+"/"+fileName);
                return;
            }
            file.createWriter(function(fileWriter) {

                if(append)
                    fileWriter.seek(fileWriter.length);
                else
                    fileWriter.seek(0);

                if(text.constructor.name!="String")
                {
                    log("<span style='color:red'>text is "+text.constructor.name+"</span>");
                    text = JSON.parseString(text);
                }
                try {
                    var blob = new Blob([text], {type: 'text/plain'});
                }catch(e)
                {
                    // TypeError old chrome and FF
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if(e.name == 'TypeError' && window.BlobBuilder){
                        var bb = new BlobBuilder();
                        bb.append([text]);
                        blob = bb.getBlob("text/plain");
                    }
                    else if(e.name == "InvalidStateError"){
                        // InvalidStateError (tested on FF13 WinXP)
                        blob= new Blob( [text], {type : "text/plain"});
                    }
                    else{
                        // We're screwed, blob constructor unsupported entirely
                        log("<span style='color:red'>No other way found<br>text:"+text+"</span>");
                        localFileWriteFailed();
                        return false;
                    }
                }
                fileWriter.write(blob);
                log("Write was successful");
                localFileWriteSuccess();
            });
        });
    });
    //return filePath;
}

function localFileRead(filePath) {
    log("going to read local file: "+filePath);
    filePath = cordova.file.externalDataDirectory+filePath;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    xmlhttp.send(null);
    status = xmlhttp.status;
    if(status==200||status==0)
    {
        return xmlhttp.responseText;
    }else{
        log(filePath+" not exists(2)!");
        return false;
    }
}



function localFileRemove(filePath,successCallback,failCallback) {
    log("going to remove local file: "+filePath);
    if(!localFileExists(filePath))
    {
        log("file not exists to remove: "+filePath);
        return;
    }
    window.resolveLocalFileSystemURL(
        filePath,
        function gotFile(fileEntry) {
            fileEntry.remove(function() {
                    log("remove was successful");
                },
                function(e){
                    log('File remove Error.'+e.code+" "+filePath);
                });
        },
        function(e) {
            log('File remove Error.'+e.code+" "+filePath);
        }
    );
    return filePath;
}

function localFileExists(filePath){
    log("check if local file exists: "+filePath);
    var response = $.ajax({
        url: filePath,
        type: 'HEAD',
        async: false
    }).status;
    return (response=="200"||response == "0") ? true : false;
}
