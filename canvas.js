const smoothnum = 100
const canvasresol = 3

var canvas = document.getElementById('canvas')
console.log(canvas)
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth*canvasresol;
ctx.canvas.height = window.innerHeight*canvasresol;

var mouse = { x: 0, y: 0 }
var last_mouse = { x: 0, y: 0 }
var mouselist = []
var mousedown=0
var beforexy = { x: 0, y: 0 }
var mouseupdate = 1

canvas.addEventListener('mousemove', function (e) {
  if (mouseupdate==0) return;
  mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  mouse.x*=canvasresol
  mouse.y*=canvasresol
}, false); //마우스 위치 갱신

canvas.addEventListener('mousedown', linestart)
canvas.addEventListener('mouseup', lineend)

setInterval(draw,0)

function linestart()
{
  beforexy.x=mouse.x
  beforexy.y=mouse.y
  mousedown=1
  mouselist = []
  for (i = 0; i < smoothnum; i++) { //100까지 시작점으로 채움
    mouselist.push({ x: mouse.x, y: mouse.y })
  }
}

function lineend()
{
  mouseupdate=0
  for(var i=0;i<=smoothnum;i++){
    draw()
  }
  mouseupdate=1
  mousedown=0
}

function draw() {
  if(mousedown==0){
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
  for (var i=0;i<smoothnum;i++)
  {
    xsum+=mouselist[i].x
    ysum+=mouselist[i].y
  }
  ctx.beginPath()
  afterx = xsum/smoothnum
  aftery = ysum/smoothnum
  ctx.moveTo(beforexy.x,beforexy.y)
  ctx.lineTo(afterx,aftery)
  beforexy.x=afterx
  beforexy.y=aftery
  ctx.stroke()
}