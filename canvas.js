var smoothnum = 30
var smoothtype = 0

function syncrange() {
  smoothtype = document.getElementById('type').value*1
  smoothnum = document.getElementById('strength').value*1
}

const canvasresol = 3

var canvas = document.getElementById('canvas')
console.log(canvas)
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth * canvasresol;
ctx.canvas.height = window.innerHeight * canvasresol;

var mouse = { x: 0, y: 0 }
var last_mouse = { x: 0, y: 0 }
var mouselist = []
var mousedown = 0
var beforexy = { x: 0, y: 0 }
var mouseupdate = 1

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
  var eventDoc, doc, body;

  event = event || window.event;

  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }
  mouse.x = event.pageX
  mouse.y = event.pageY
  mouse.x *= canvasresol
  mouse.y *= canvasresol
  mouselist.shift()
  mouselist.push({ x: mouse.x, y: mouse.y })
}

canvas.addEventListener('mousedown', linestart)
canvas.addEventListener('mouseup', lineend)

setInterval(draw, 1)

function linestart() {
  beforexy.x = mouse.x
  beforexy.y = mouse.y
  mousedown = 1
  mouselist = []
  for (i = 0; i < smoothnum; i++) { //100까지 시작점으로 채움
    mouselist.push({ x: mouse.x, y: mouse.y })
  }
}

function lineend() {
  mouseupdate = 0
  for (var i = 0; i <= smoothnum; i++) {
    draw()
  }
  mouseupdate = 1
  mousedown = 0
}

function draw() {
  if (mousedown == 0) {
    return;
  }
  mouselist.shift()
  mouselist.push({ x: mouse.x, y: mouse.y })

  ctx.lineWidth = canvasresol;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  var xsum = 0
  var ysum = 0
  for (var i = 0; i < smoothnum; i++) {
    if (false) {
      xsum += mouselist[i].x
      ysum += mouselist[i].y
    }
    else {
      xsum += mouselist[i].x * (i + 1)
      ysum += mouselist[i].y * (i + 1)
    }
  }
  ctx.beginPath()
  if (false) {
    aftery = ysum / smoothnum
    afterx = xsum / smoothnum 
  }
  else {
    aftery = ysum / (smoothnum * (smoothnum + 1) / 2)
    afterx = xsum / (smoothnum * (smoothnum + 1) / 2)
  }
  ctx.moveTo(beforexy.x, beforexy.y)
  ctx.lineTo(afterx, aftery)
  beforexy.x = afterx
  beforexy.y = aftery
  ctx.stroke()
}