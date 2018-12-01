const quoteFetch = fetch("quote")
  .then(res => res.text());

// S/O https://stackoverflow.com/a/16599668/2856889
function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
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
  const numLinesAboveCenterline = (numTextLines - 1) / 2
  const textBoxTop = centerLine - numLinesAboveCenterline * textHeight

  const lineIndices = [...Array(numTextLines).keys()] // if numTextLines = 5, return [0, 1, 2, 3, 4]
  const heights = lineIndices.map(i => textBoxTop + i * textHeight)

  return heights;
}

function drawText(text){

  const textHeightPixels = 48;
  const imageHeight = 650;

  const ctx = quoteContext;
  ctx.font = textHeightPixels + 'px cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'steelblue';

  const textLines = getLines(ctx, text, 650 - 20);

  const topHeights = getTopHeights(textLines.length, textHeightPixels, imageHeight);

  for (var i = textLines.length - 1; i >= 0; i--) {
    const currentLine = textLines[i];
    const currentHeight = topHeights[i];
    ctx.fillText(currentLine, 325, currentHeight);
  }


}

const quoteImage = new Image(),
  quoteCanvas = document.getElementById('quote-image'),
  quoteContext = quoteCanvas.getContext('2d')
;

quoteImage.src = 'https://www.google.nl/images/srpr/logo3w.png';


// S/O https://stackoverflow.com/a/26015533/2856889
quoteImage.onload = function(){
    quoteContext.drawImage(quoteImage,
        70, 20,   // Start at 70/20 pixels from the left and the top of the image (crop),
        50, 50,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0, 0,     // Place the result at 0, 0 in the canvas,
        650, 650); // With as width / height: 100 * 100 (scale)
    quoteFetch.then(drawText)
}