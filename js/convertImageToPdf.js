const fs = require('fs');
const PDFDocument = require('pdfkit');

var inputPath =  process.argv[2];
var outputPath =  process.argv[3];

console.log("input: " + inputPath);
console.log("output: " + outputPath);

//convertJpgToPdf(inputPath, outputPath);
//console.log("Image is processed succesfully");

async function handleImageToPdf(inputPath, outputPath)
{
    try{		
	var resolve = await convertJpgToPdf(inputPath, outputPath);
	 
	console.log("Image is processed succesfully");
	
	return (resolve);
    }
	catch(err) {console.error('handleImageToPdf error' + err);}
	
}


// Functie om JPG naar PDF te converteren
async function convertJpgToPdf(inputPath, outputPath) {
  try {
	  
    // Maak een nieuw PDF-document met dezelfde afmetingen als de afbeelding
    const doc = new PDFDocument({autoFirstPage:false});
    var img = doc.openImage('../../../../../..' + inputPath);
    //console.log('Image height : ' + img.height);
	//console.log('Image width : ' + img.width);
	
	var A4_WIDTH;
	var A4_HEIGHT;
	var scaledWidth = img.width;
	var scaledHeight = img.height;
	
	// A4-afmetingen in punten (bij 72 dpi)
	if(img.height > img.width)
	{
    var A4_HEIGHT = 841.89;
    var A4_WIDTH  = 595.28;
	}
	else
	{
	var A4_HEIGHT = 595.28;
    var A4_WIDTH  = 841.89;
	}
    // Bereken de schaalfactor om de afbeelding in A4 te passen, behoud verhouding
    const scaleFactor = Math.min(A4_WIDTH / img.width, A4_HEIGHT / img.height);
	
	
	if (scaleFactor < 1){
    scaledWidth  = img.width  * scaleFactor;
    scaledHeight = img.height * scaleFactor;
	}
			
	console.log("scale factor: " + scaleFactor);
	console.log("image width: " + img.width);
	console.log("image height: " + img.height);
	
	console.log("scaled width: " + scaledWidth);
	console.log("scaled height: " + scaledHeight);
	
	
	//var imageSize = (img.height * img.width * img.bits) / 8; 
	//console.log('Image bits : ' + img.bits);
	//console.log('image size : ' + imageSize);
    // Schrijf het PDF-bestand naar een output-bestand
    doc.pipe(fs.createWriteStream('../../../../../..' + outputPath));
	if (scaleFactor < 1){
    if(img.height > img.width) {
		  doc.addPage(
		  //{layout: 'portrait', size: 'a4'});
          {size: [scaledWidth, scaledHeight]});
		  doc.image(img, 0, 0, {scale: scaleFactor});
	}	
	else
	{
		  doc.addPage(
		  //{layout: 'landscape', size: 'a4'});
          {size: [scaledWidth, scaledHeight]});
		  doc.image(img, 0, 0, {scale: scaleFactor});
		  //{size: [img.width, img.height]});
	
	}
	}
	else
	{
		 if(img.height > img.width) {
		  doc.addPage(
		  {size: [scaledWidth, scaledHeight]});
		  doc.image(img, 0, 0);
	}	
	else
	{
		  doc.addPage(
		  {size: [scaledWidth, scaledHeight]});
		  doc.image(img, 0, 0);
	}
	}	
	//console.log('Image height : ' + img.height);
	//console.log('Image width : ' + img.width);
	
   
    // Sluit het PDF-document af
    doc.end();

    console.log(`PDF succesvol gegenereerd: ${outputPath}`);
  } catch (err) {
    console.error('Fout bij het converteren van JPG naar PDF:', err);
  }
}



module.exports = {
  handleImageToPdf: handleImageToPdf,  
  };     
  