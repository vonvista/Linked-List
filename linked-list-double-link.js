var animSpeed = 4
var easing = 0.05 * animSpeed
const boxSize = 35;

const headXinit = 30;
const headYinit = 50;

var nodeDistX = boxSize * 3
var nodeDistY = boxSize * 3

var posXinit = headXinit;
var posYinit = headYinit + nodeDistY;

var pageCutX = 600;

var controlsHeight = document.getElementById("controlMain").offsetHeight 

//COLORS
const YELLOW = [255, 242, 0]
const BASE_BLUE = [41, 89, 126]
const LIGHT_YELLOW = [171, 176, 62]
const WHITE = [255, 255, 255]
const LIGHT_ORANGE = [176, 128, 62]
const LIGHT_RED = [176, 62, 62]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

class indexNode {
  constructor() {
    this.value = "H"
    this.x = 500
    this.y = posYinit
    this.color = BASE_BLUE
  }
  draw() {
    strokeWeight(1)
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x + boxSize/2, this.y + boxSize/2, boxSize, boxSize)

    noStroke()

    //triangle
    push() //start new drawing state
    var offset = 15
    var angle = 90
    translate(this.x + boxSize/2, this.y - boxSize/2 + 7);
    rotate(0); //rotates the arrow point
    triangle(-offset*0.8, offset, offset*0.8, offset, 0, -offset/10); //draws the arrow point as a triangle
    pop();

    //text
    fill(WHITE)
    text(this.value, this.x + boxSize/2, this.y + boxSize/2)
  }

  async movePos(newX, newY) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
  }
}

class searchNode {
  constructor() {
    this.x = -100
    this.y = posYinit
    this.image = search_icon_base
  }
  draw() {
    image(this.image, this.x, this.y, 40, 40);
  }

  async movePos(newX, newY) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
    this.x = headXinit
    this.y = headYinit
    this.color = LIGHT_RED
    this.offsetY = boxSize/2;
  }

  draw() {
    //BOXES
    strokeWeight(1)
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x + boxSize/2, this.y + boxSize/2, boxSize, boxSize)
    rect(this.x + boxSize + boxSize/2, this.y + boxSize/2, boxSize, boxSize)
    noStroke()
    fill(255)
    text("H", this.x + boxSize/2, this.y + boxSize/2)

    strokeWeight(1)
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x + boxSize/2 + nodeDistX, this.y + boxSize/2, boxSize, boxSize)
    rect(this.x + boxSize + boxSize/2 + nodeDistX, this.y + boxSize/2, boxSize, boxSize)
    noStroke()
    fill(255)
    text("T", this.x + boxSize/2 + nodeDistX, this.y + boxSize/2)

    //LINE
    if(this.head != null){
      stroke(106, 179, 235)
      fill(106, 179, 235)
      //strokeWeight(3);
      line(this.x + boxSize + boxSize/2, this.y + this.offsetY, this.head.x, this.head.y + this.offsetY)
      push() //start new drawing state
      var offset = 8
      var angle = atan2(this.y - this.head.y, this.x + boxSize + boxSize/2 - this.head.x);
      translate((this.x + boxSize + boxSize/2 + this.head.x)/2, (this.y + this.head.y)/2 + this.offsetY);
      rotate(angle-HALF_PI); //rotates the arrow point
      triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
      pop();
    }

    if(this.tail != null){
      stroke(106, 179, 235)
      fill(106, 179, 235)
      //strokeWeight(3);
      line(this.x + boxSize + boxSize/2 + nodeDistX, this.y + this.offsetY, this.tail.x, this.tail.y + this.offsetY)
      push() //start new drawing state
      var offset = 8
      var angle = atan2(this.y - this.tail.y, this.x + boxSize + boxSize/2 - this.tail.x + nodeDistX);
      translate((this.x + boxSize + boxSize/2 + this.tail.x + nodeDistX)/2, (this.y + this.tail.y)/2 + this.offsetY);
      rotate(angle-HALF_PI); //rotates the arrow point
      triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
      pop();
    }
  }

  async insertAtTail(element) {
    // creates a new node
    

    var node = new Node(element, -50, posYinit);
    nodes.push(node)
    
    if (this.tail) {
      await node.movePos(this.tail.x, this.tail.y + boxSize + 10)
      this.tail.next = node
      
    }
    else {
      await node.movePos(posXinit, posYinit + boxSize + 10)
      this.head = node;
      
    }
    node.prev = this.tail
    this.tail = node;
    
    
    //await node.movePos(this.tail.x, this.tail.y - boxSize - 10)
    await this.adjustAtNodeForward(this.head) 
  }
  async insertAtHead(element){

    var node = new Node(element, -50, posYinit);
    nodes.unshift(node)
    await node.movePos(posXinit, posYinit + boxSize + 10)
    await sleep(70)
    
    node.next = this.head

    if(!this.head) {
      this.head = node
      this.tail = node
      await this.adjustAtNodeForward(this.head)
      return
    }
    this.head.prev = node
    this.head = node
    

    await this.adjustAtNodeForward(this.head)
  }

  async deleteAtTail(){
    var del = this.tail
    if(!del){
      return;
    }
    
    this.tail = del.prev;
    
    if(!this.tail) {
      this.head = null;
      await del.movePos(-100, del.y)
      nodes.pop()
      return;
    }

    
    this.tail.next = null
    del.prev = null;
    await del.movePos(del.x, del.y + boxSize + 10)
    await del.movePos(-100, del.y)
    nodes.pop()

    // if(this.head != null) this.adjustAtNodeForward(this.head)
  }

  async deleteAtHead(){
    var del = this.head
    if(!del){
      return;
    }
    
    this.head = this.head.next;
    
    if(!this.head) {
      this.tail = null;
      await del.movePos((boxSize * -2) - 10, del.y)
      nodes.pop()
      return;
    }

    del.next = null
    this.head.prev = null;
    await del.movePos((boxSize * -2) - 10, del.y)
    nodes.shift()

    if(this.head != null) this.adjustAtNodeForward(this.head)
  }

  async adjustAtNodeForward(current) {
    var posX = posXinit
    var posY = posYinit
    
    while (current) {
      
      if(posX + nodeDistX < windowWidth - pageCutX) {
        current.movePos(posX, posY)
      }
      else {
        posX = posXinit
        posY += nodeDistY
        current.movePos(posX, posY)
      }
      posX += nodeDistX
      await sleep(2)
      
      current = current.next;
    }
  }
  async printList() {
    var current = this.head
    while(current){
      console.log(current)
      current = current.next
    }
  }
}

class Node {
  constructor(value, x, y) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.color = BASE_BLUE 
    this.offsetY = boxSize/2
    this.x = x
    this.y = y
    this.nEndX = x
    this.nEndY = y
    this.pEndX = x
    this.pEndY = y
    
  }
  async draw() {

    if(this.prev != null){
      // console.log(this.endx == this.next.x)
      //console.log(Math.round(this.endx) == Math.round(this.next.x))
      if(Math.ceil(this.pEndX) != Math.ceil(this.prev.x + boxSize + boxSize/2)){
        console.log("NARITO")
        this.pEndX = this.pEndX + (this.prev.x + boxSize + boxSize/2 - this.pEndX) * easing
        this.pEndY = this.pEndY + (this.prev.y + 7 - this.pEndY) * easing
      }
      else {
        
        this.pEndX = this.prev.x + boxSize + boxSize/2 
        this.pEndY = this.prev.y + 7
      }

      stroke(WHITE)
      fill(WHITE)
      //strokeWeight(3);
      line(this.x, this.y + this.offsetY + 7, this.pEndX, this.pEndY + this.offsetY)
      push() //start new drawing state
      var offset = 8
      var angle = atan2(this.y - this.pEndY + 7, this.x - this.pEndX);
      translate((this.x + this.pEndX)/2, (this.y + this.pEndY + 7)/2 + this.offsetY);
      rotate(angle-HALF_PI); //rotates the arrow point
      triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
      pop();  
    }


    strokeWeight(1)
    stroke(28, 42, 53)
    fill(this.color[0], this.color[1], this.color[2])
    rect(this.x + boxSize/2, this.y + boxSize/2, boxSize, boxSize)
    rect(this.x + boxSize + boxSize/2, this.y + boxSize/2, boxSize, boxSize)
    noStroke()
    fill(255)
    text(this.value, this.x + boxSize/2, this.y + boxSize/2)

    if(this.next != null){
      // console.log(this.endx == this.next.x)
      //console.log(Math.round(this.endx) == Math.round(this.next.x))
      if(Math.round(this.nEndX) != Math.round(this.next.x)){
        this.nEndX = this.nEndX + (this.next.x - this.nEndX) * easing
        this.nEndY = this.nEndY + (this.next.y - 7 - this.nEndY) * easing
      }
      else {
        this.nEndX = this.next.x
        this.nEndY = this.next.y - 7
      }

      stroke(WHITE)
      fill(WHITE)
      //strokeWeight(3);
      line(this.x + boxSize + boxSize/2, this.y + this.offsetY - 7, this.nEndX, this.nEndY + this.offsetY)
      push() //start new drawing state
      var offset = 8
      var angle = atan2(this.y - this.nEndY - 7, this.x + boxSize + boxSize/2 - this.nEndX);
      translate((this.x + boxSize + boxSize/2 + this.nEndX)/2, (this.y + this.nEndY - 7)/2 + this.offsetY);
      rotate(angle-HALF_PI); //rotates the arrow point
      triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
      pop();  
    }

  }
  async movePos(newX, newY) {
    if(this.next){
      this.nEndX = this.next.x
      this.nEndY = this.next.y
    }
    else {
      this.nEndX = newX
      this.nEndY = newY
    }

    if(this.prev){

      this.pEndX = this.prev.x + boxSize + boxSize/2
      this.pEndY = this.prev.y + 7
    }
    else {
      this.pEndX = newX
      this.pEndY = newY
    }


    for(let i = 0; i <= (150 / animSpeed); i++){
      this.x = this.x + (newX - this.x) * easing
      this.y = this.y + (newY - this.y) * easing
      await sleep(2)
    }
    
    this.x = newX
    this.y = newY
    
  }
}

function handleAdj() { 
  nodeDistX = parseInt(document.getElementById("widthDistAdj").value)
  nodeDistY = parseInt(document.getElementById("heightDistAdj").value)
  pageCutX = parseInt(document.getElementById("cutoffAdj").value)

  ll.adjustAtNodeForward(ll.head)
}

//DOM VARIABLES
var buttonControls = document.getElementsByClassName("buttonControls");
//GENERAL FUNCTIONS

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  statusText = "Standby"
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  //document.getElementById("animSlider").innerHTML = output * 50
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
  //var output = 
  //output.innerHTML = slider.value; // Display the default slider value
}



//CONTROLS FUNCTIONS
async function handleInsertAtTail() { 

  disableButtonControls()
  let element = document.getElementById("functionElement").value
  if(element == "" || element == null) {
    enableButtonControls()
    return
  }
  statusText = "Running: Insert at Tail(" + element + ")"
  await ll.insertAtTail(element)
  enableButtonControls()
}

async function handleInsertAtHead() { 

  disableButtonControls()
  let element = document.getElementById("functionElement").value
  if(element == "" || element == null) {
    enableButtonControls()
    return
  }
  statusText = "Running: Insert at Head(" + element + ")"
  await ll.insertAtHead(element)
  enableButtonControls()
}

async function handleDeleteAtHead() { 

  disableButtonControls()
  let element = document.getElementById("functionElement").value
  // if(element == "" || element == null) {
  //   enableButtonControls()
  //   return
  // }
  statusText = "Running: Delete at Head"
  await ll.deleteAtHead()

  enableButtonControls()
}

async function handleDeleteAtTail() { 

  disableButtonControls()
  let element = document.getElementById("functionElement").value
  // if(element == "" || element == null) {
  //   //enableButtonControls()
  //   return
  // }
  statusText = "Running: Delete at Tail"
  await ll.deleteAtTail()

  enableButtonControls()
}

async function handleInsertAtIndex() { 

  disableButtonControls()
  let index = document.getElementById("functionIndex").value
  let element = document.getElementById("functionElement").value
  if(index == "" || index == null || isNaN(index) || element == "" || element == null) {
    enableButtonControls()
    return
  }
  statusText = "Running: Insert " + element + " at Index " + index
  await ll.insertAtIndex(element, parseInt(index))

  enableButtonControls()
}

async function handleDeleteAtIndex() { 

  disableButtonControls()
  let index = document.getElementById("functionIndex").value
  if(index == "" || index == null || isNaN(index)) {
    enableButtonControls()
    return
  }
  statusText = "Running: Delete At Index " + index
  await ll.deleteAtIndex(parseInt(index))

  enableButtonControls()
}

nodes = []


var ll = new LinkedList()
var iNode = new indexNode()
var sNode

var statusText = "Standby"

var search_icon_base
function preload() {
  search_icon_base = loadImage('assets/search_1.png');
}

async function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  sNode = new searchNode()

  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  // nodes.push(new Node(2, 10, 10));
  await ll.insertAtHead(4)
  await ll.insertAtHead(5)
  await ll.insertAtHead(6)

  // await ll.insertAtHead(7)
  // await ll.insertAtTail(8)
  // await ll.insertAtTail(9)
  // await ll.insertAtTail(10)
  // await ll.insertAtTail(11)
  // await ll.insertAtTail(12)

  // nodes.push(new Node(3, 120, 10));

  // nodes[0].next = nodes[1]
  pixelDensity(displayDensity());
}

function draw() {
  background(28, 42, 53);
  textAlign(CENTER, CENTER)
  ll.draw();

  //update easing
  easing = 0.05 * animSpeed

  for(node of nodes){
    node.draw()
  }
  sNode.draw()

  //iNode.draw()

  stroke(BASE_BLUE)
  fill(BASE_BLUE)
  line(windowWidth - pageCutX, 0, windowWidth - pageCutX, windowHeight)
  text("CUT", windowWidth - pageCutX + 20, 20)

  fill(WHITE)
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)
}

function mousePressed() {
  // console.log(mouseX, mouseY)
  if (mouseButton === RIGHT) {
    //ll.printList()
    console.log(nodes)
  }
}

function windowResized() {
  controlsHeight = document.getElementById("controlMain").offsetHeight 
  resizeCanvas(windowWidth, windowHeight - controlsHeight)
}



