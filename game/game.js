/*
Treenimise ajal ilmuvad konsooli jooksvalt täpsuse protsendid.
Konsooli avamiseks tuleb vajutada CTRL+SHIFT+J.
*/


let canvas = document.createElement("canvas");
let text = document.createElement("p");

ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 480;
document.body.appendChild(canvas);
document.body.appendChild(text);
let fps = 1000 / 60
let bulletSize = 10
let playerWidth = 30
let playerHeight = 30
let targetSize = 40
let bullets = []
let remove = []
let player = new character(canvas.width / 2 - playerWidth / 2, canvas.height - playerHeight, playerWidth, playerHeight, "black")
let target = new character(0,0, targetSize, targetSize, "green")
let form1 = document.getElementById("frm1")
let testing = false
let nn = new Neural_Network(2, [8,8], 1)
nn.randomize_weights()
function train(){
    text.innerText = "Training..."
    setTimeout(()=>{
        newTarget()
        nn.learning_rate = 0.1
        //treenitakse, aga vahepeal muudetakse learning_rate muutjat, ehk õppimise käigus tehtud muudatuste suurus
        for (let i = 1; i <= 2; i++) {
            console.log(nn.learning_rate, "Learning rate")
            training(1000000*2)
            //training(50000)
            nn.learning_rate = Math.round((nn.learning_rate/2)*1000000)/1000000
            
        }
    },1000)
}

newTarget()
setInterval(frameupdate, 16);
function testON(){
    testing = true
}
function testOFF(){
    testing = false
}
//treenimisega tegelev funktsioon
function training(amount){
    let correct = 0
    let wrong = 0
    for (let i = 0; i < amount; i++) {
        angle1 = calcAngle(player.x,player.y,target.x,target.y)//arvutab õige vastuse
        angle = map(angle1,0,180,0,1)//paneb vastuse 0 ja 1 vahele
        tx = map(target.x,0,canvas.width,0,1)
        ty = map(target.y,0,canvas.height,0,1)
        guess = nn.train([tx,ty],[angle])//pakub vastust ja treenitakse
        if (Math.abs((guess[0]*180)-(angle*180))<5){//kui viga on väiksem kui 5 kraadi, siis loetakse, et oleks pihta läinud
            correct+=1
        }else{
            wrong+=1
        }
        if(correct+wrong === amount/5){
            var accuracy = Math.round(correct/(wrong+correct)*100000)/1000
            console.log(accuracy)
            wrong = 0
            correct = 0
        }
        testing = true
        newTarget()
    }
    text.innerText = "Training accuracy: "+accuracy+"%"
}

function frameupdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    target.draw()
    if (testing){
        testAI()
    }
    drawBullets()
    removeBullets()
}
//peale treenimist testimine, õppimist siin ei toimu
function testAI(){
    dist = removeBullets()
    if (bullets.length === 0){
        newTarget()
        tx = map(target.x,0,canvas.width,0,1)
        ty = map(target.y,0,canvas.height,0,1)
        guess = nn.feed_forward([tx,ty])
        writeInput(0,200)
        writeInput(1,guess[0]*180)
        shoot()
    }

}
function character(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color

    this.draw = function () {
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}



function newTarget() {
    let random = {x: Math.random() * (canvas.width - targetSize), y: Math.random() * (canvas.height - targetSize*2) }
    newt = new character(random.x, random.y, targetSize, targetSize, "green")
    //uus ei võiks olla lähedal sellele, kus see enne oli või liiga lähedal mängijale
    if (rectToRectDist(player,newt)>100 && rectToRectDist(newt, target)>40){
        target = newt
    }else{
        newTarget()
        
    }
}
function rectToRectDist(a, b) {
    let center_a = {x: a.x + a.w/2,y: a.y + a.h/2}
    let center_b = {x: b.x + b.w/2,y: b.y + b.h/2}
    let dx = center_a.x-center_b.x
    let dy = center_a.y-center_b.y
    let dist = Math.sqrt(dx**2+dy**2)
    return dist
}
//loeb html form elementi
function readInput() {
    let i
    let len = form1.length
    let values = []
    for (i = 0; i < len; i++) {
        let val = form1.elements[i].value
        values.push(val)
    }
    return values
}
//kuvab muudatusi html form elemendis
function writeInput(i,val){
    form1.elements[i].value = val
}
function shoot() {
    let power = readInput()[0]
    let angle = readInput()[1]
    bullets.push(new bulletgen(player.x + playerHeight / 2, player.y, bulletSize, "blue", power, angle))
}
canvas.addEventListener("click", function (event) {
    mouseX = event.clientX - 8 - 10
    mouseY = event.clientY - 8 - 10
    shoot()
})
//kuuli class
function bulletgen(x, y, r, color, power, angle) {
    this.x = x
    this.y = y
    this.r = r
    this.color = color
    this.speed = 0
    this.gravity = 0.1
    this.alive = true
    this.draw = function () {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fill()
        this.speed += this.gravity
        if (this.alive) {
            this.x -= Math.cos(angle * Math.PI / 180) * power / 10
            this.y -= Math.sin(angle * Math.PI / 180) * power / 10 - this.speed
        }
    }
}
function RectCircleColliding(circle, rect, adist) {
    let distX = Math.abs(circle.x - rect.x - rect.w / 2);
    let distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    let dx = distX - rect.w / 2;
    let dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r) + adist);
}
function drawBullets() {
    let i
    let len = bullets.length
    for (i = 0; i < len; i++) {
        if (bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y > canvas.height) {
            if(bullets[i].alive){
                remove.push(i)
            }
            bullets[i].alive = false
        }
        if (bullets[i].alive) {
            if (RectCircleColliding(bullets[i], target, 0)) {
                if(bullets[i].alive){
                    remove.push(i)
                }
                bullets[i].alive = false
                bullets[i].color = "red"
                bullets[i].distance = 0
                
            }
        }
        bullets[i].draw()
    }

}
function removeBullets() {
    let len = remove.length
    let dist = []
    for (let i = 0; i < len; i++) {
        dist.push(bullets[remove[i]].distance)
    }
    for (let i = 0; i < len; i++) {
        bullets.splice(remove[i], 1)
    }
    remove = []
    return dist
    
}


function calcAngle(x1,y1,x2,y2){
    let dx = x1 - x2
    let dy = y1 - y2 
    let angle = Math.atan2(dy,dx)* 180/Math.PI
    return angle
}
function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}





