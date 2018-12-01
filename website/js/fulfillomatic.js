

// Putting text on the image

// S/O https://stackoverflow.com/a/16599668/2856889
function getLines(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function getTopHeights(numTextLines, textHeight, imageHeight) {
    const centerLine = imageHeight / 2 - textHeight / 2;
    const numLinesAboveCenterLine = (numTextLines - 1) / 2;
    const textBoxTop = centerLine - numLinesAboveCenterLine * textHeight;

    const lineIndices = [...Array(numTextLines).keys()]; // if numTextLines = 5, return [0, 1, 2, 3, 4]

    return lineIndices.map(i => textBoxTop + i * textHeight);
}

function drawText(text){

    const textHeightPixels = 48;
    const imageHeight = 650;

    const ctx = quoteContext;
    ctx.font = textHeightPixels + 'px cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';

    const textLines = getLines(ctx, text, 650 - 20);

    const topHeights = getTopHeights(textLines.length, textHeightPixels, imageHeight);

    for (let i = textLines.length - 1; i >= 0; i--) {
        const currentLine = textLines[i];
        const currentHeight = topHeights[i];
        ctx.fillText(currentLine, 325, currentHeight);
    }


}

// And now, the business.

const quoteFetch = fetch("quote")
    .then(res => res.text());

const quoteImage = new Image(),
    quoteCanvas = document.getElementById('quote-image'),
    quoteContext = quoteCanvas.getContext('2d')
;

// Select a random image
fetch("img/quote-background/manifest.json")
    .then(res => res.json())
    .then(jsonArray => jsonArray[Math.floor(Math.random() * jsonArray.length)])
    .then(imageFilename => "img/quote-background/" + imageFilename)
    .then(imageURL => {quoteImage.src = imageURL});
// quoteImage.src = 'https://www.google.nl/images/srpr/logo3w.png';


// S/O https://stackoverflow.com/a/26015533/2856889
quoteImage.onload = function(){
    quoteContext.drawImage(quoteImage,
        0, 0,   // Start at 70/20 pixels from the left and the top of the image (crop),
        650, 650,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0, 0,     // Place the result at 0, 0 in the canvas,
        650, 650); // With as width / height: 100 * 100 (scale)
    quoteFetch.then(drawText)
};