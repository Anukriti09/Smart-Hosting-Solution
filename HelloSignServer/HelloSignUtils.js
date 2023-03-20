const hellosign = require('hellosign-sdk')({key: '2484dc6fd15000a2143ea856eb045de0c360cf097c4fa592111981c88ce8436f'});
const {PDFDocument} = require('pdf-lib')
const fs = require("fs");

async function generatePDF(pngImageBytes,file_name){
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()
    // console.log(pngImageBytes)
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    //We take a snapshot of the doc and embed in the newly created pdfdoc. 

    // Add a blank page to the document
    const page = pdfDoc.addPage()

    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
    })
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(file_name, pdfBytes);
    //Storing the pdf temporarily
}

function sendSignatureRequest(signers,title,subject,message,file_name){

  let options = {
    test_mode : 1,
    title : title,
    subject : subject,
    message : message,
    signers : signers,
    files: file_name,
    };
    
    console.log(options)
    // hellosign.signatureRequest.send(options)
    const result = hellosign.signatureRequest.send(options);
    result.then(response => {
        console.log(response);
    }).catch(error => {
        console.log("Exception when calling HelloSign API:");
        console.log(error);
    });
}

function downloadFile(request_id){
  hellosign.signatureRequest.download(request_id, {file_type: 'zip'}, function(err, response) {
    var file = fs.createWriteStream("files.zip");
    response.pipe(file);
    file.on('finish', function() {
      file.close();
    });
  });
}

async function getPendingList(){
  try{
    let list = await hellosign.signatureRequest.list()
    console.log(list)
    return list.signature_requests;
  }catch(error){
    return {mes: error};
  }
  
}

module.exports = {generatePDF,sendSignatureRequest,downloadFile,getPendingList}