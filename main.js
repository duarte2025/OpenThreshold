const fileinput = document.getElementById('fileinput')

const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

const threshold = document.getElementById('threshold')

const srcImage = new Image

let imgData = null

let originalPixels = null

let currentPixels = null

const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2

function getIndex(x, y) {
  return (x + y * srcImage.width) * 4
}

function clamp(value) {
  return Math.max(0, Math.min(Math.floor(value), 255))
}


function addThreshold(x, y, value) {
  const redIndex = getIndex(x, y) + R_OFFSET
  const greenIndex = getIndex(x, y) + G_OFFSET
  const blueIndex = getIndex(x, y) + B_OFFSET

  const redValue = currentPixels[redIndex]
  const greenValue = currentPixels[greenIndex]
  const blueValue = currentPixels[blueIndex]

  var v = (0.2126*redValue + 0.7152*greenValue + 0.0722*blueValue >= value) ? 255 : 0;

  const nextRed = v
  const nextGreen = v
  const nextBlue = v

  currentPixels[redIndex] = clamp(nextRed)
  currentPixels[greenIndex] = clamp(nextGreen)
  currentPixels[blueIndex] = clamp(nextBlue)
}

function commitChanges() {
  for (let i = 0; i < imgData.data.length; i++) {
    imgData.data[i] = currentPixels[i]
  }

  ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
}

function runPipeline() {
  currentPixels = originalPixels.slice()

  const thresholdFilter = Number(threshold.value)

  for (let i = 0; i < srcImage.height; i++) {
    for (let j = 0; j < srcImage.width; j++) {

      addThreshold(j, i, thresholdFilter)
    }
  }

  commitChanges()
}

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0])
  }
}

srcImage.onload = function () {
  canvas.width = srcImage.width
  canvas.height = srcImage.height
  ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
  imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
  originalPixels = imgData.data.slice()
}

threshold.onchange = runPipeline