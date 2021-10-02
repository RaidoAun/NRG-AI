/*
Mida võiks proovida muuta:
fitness funktsiooni ehk muuta arvu x astet.
shooter.js failis outputide arvu.
tingimust, millal luuakse uus generatsioon
test_count, shooter_count muutujat
uue generatsiooni funktsioone
Mõndades nendest kohtadest on koodis juba kommentaarina olemas näide.
*/
let canvas = document.createElement("canvas");
let current_gentext = document.createElement("p");
let show_best = document.getElementById("best_box")
let freeze_target = document.getElementById("freeze_target")
let random_target = document.getElementById("random_target")
let form1 = document.getElementById("frm1")

random_target.checked = true
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
document.body.appendChild(canvas);
document.body.appendChild(current_gentext);
//algsete muutujate loomine
let maxDist = (canvas.width**2 + canvas.height**2)**0.5
let interval = 16//mis aja tagant jooksutada mängu loogikat (ms)
let bulletSize = 5
let playerWidth = 30
let playerHeight = 30
let targetSize = 40
let bullets = []
let shooters = []
let shooter_count = 500
let test_count = 10
let bullet_hit_target = false
let counter = 0
let player = new character(canvas.width-playerWidth, canvas.height - playerHeight, playerWidth, playerHeight, "black")
let target = new character(0,0,targetSize,targetSize)
let newCount = shooter_count/2 //uues generatsioonis juhuslikult loodud närvivõrkude arv
form1.elements[1].value=newCount
let testing = false
let SPEED = readInput()[0]
let generation = 0
let target_pos_index = 0
current_gentext.innerText = "Generation: "+generation
newTarget()
//objektide loomine, mängu alustamine
for (let i = 0; i < shooter_count; i++) {
    shooters[i] = new Shooter()
}

function frameupdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    //ei pea koguaeg joonistama, for loop teeb mängu arvutusi SPEED arv kordi ja peale seda joonistab
    for (let i = 0; i < SPEED; i++) {
        //tingimus, millal luua uus märk
        if (countAlive() === 0){//(countAlive() === 0) // || bullet_hit_target
            for (let i = 0; i < shooter_count; i++) {
                shooters[i].shoot()
            }
            counter++
            if (counter === test_count){
                
                generation+=1
                current_gentext.innerText = "Generation: "+generation
                //valida kumbki uue generatsiooni funktsioonidest, selgitused all
                //shooters = nextGen(shooters)
                shooters = nextCrossOverGen(shooters)
                counter = 0
            }
            if (!freeze_target.checked){
                newTarget()
            }
            bullet_hit_target = false
        }
        target.draw()
        updateBullets()
    }
    drawBullets()
}
let game_loop = setInterval(frameupdate,interval);
function countAlive(){
    let c = 0;
    for (let i = 0; i < shooters.length; i++) {
        if (shooters[i].bullet.alive) {
            c++
        }
    }
    return c
}
//html failis olevad nupud viitavad nendele funktsioonidele
//------------
function changeSpeedtoOne(){
    SPEED = 1
}
function changeSpeed(){
    SPEED=readInput()[0]
}
function changeNewCount(){
    newCount = readInput()[1]
}
function changeInterval(){
    clearInterval(game_loop)
    interval = readInput()[2]
    game_loop = setInterval(frameupdate,interval)
}
function setIntervalto16(){
    clearInterval(game_loop)
    interval = 16
    game_loop = setInterval(frameupdate,interval)
}
//------------
//loeb veebilehelt andmeid
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

function drawBullets() {
    for (let i = 0; i < shooter_count; i++) {
        if (show_best.checked){
            if (shooters[i].best){
                shooters[i].drawBullet()
            }
        }else{
            shooters[i].drawBullet()
        }
        
    }
}
function updateBullets() {
    for (let i = 0; i < shooter_count; i++) {
        shooters[i].updateBullet()
    }
}
//character klass (mängija ja märk kasutavad seda)
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
    if (random_target.checked){
        let random = {x: Math.random() * (canvas.width - targetSize), y: Math.random() * (canvas.height - targetSize*2) }
        newt = new character(random.x, random.y, targetSize, targetSize, "green")
        //uus ei võiks olla lähedal sellele, kus see enne oli või liiga lähedal mängijale
        if (rectToRectDist(newt, target)>100 && rectToRectDist(player,newt)>40){
            target = newt
        }else{
            newTarget()
        }
    }else{
        //mõned ette antud kohad, et testida igat ekraani osa.
        if (target_pos_index==0){
            target = new character(canvas.width/4,canvas.height-targetSize*2,targetSize,targetSize, "green")
        }
        if (target_pos_index==1){
            target = new character(canvas.width/4,canvas.height/2,targetSize,targetSize, "green")
        }
        if (target_pos_index==2){
            target = new character(canvas.width/4,canvas.height/4,targetSize,targetSize, "green")
           
        }
        if (target_pos_index==3){
            target = new character(canvas.width/2,canvas.height/4,targetSize,targetSize, "green")
        }
        if (target_pos_index==4){
            target = new character((canvas.width-targetSize*2),canvas.height/4,targetSize,targetSize, "green")
            target_pos_index=-1
        }
        target_pos_index+=1
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

function calcDistance(x1, y1, x2, y2) {
    let dx = x1 - x2
    let dy = y1 - y2
    let distance = Math.sqrt(dx ** 2 + dy ** 2)
    return distance
}
function RectCircleColliding(circle, rect, adist) {
    let distX = Math.abs(circle.x - rect.x - rect.w / 2);
    let distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false; 
    }

    if (distX <= (rect.w / 2)) {
        return true; 
    }
    if (distY <= (rect.h / 2)) {
        return true; 
    }

    let dx = distX - rect.w / 2;
    let dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r) + adist);
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
//tasub vaadata evolution.js faili lib kaustas
//ei kasuta crossover funktsiooni
//valitakse üks isend, muudetakse ja otse uude generatsiooni
function nextGen(population){
    population = calcFitness(population,fitnessFunc)
    let newgen = []
    let split_point = population.length-newCount
    //kasutab mutatsiooni eelmise generatsiooni peal
    for (let i = 0; i < split_point; i++) {
        let parent = pickParent(population)
        let child = new Shooter(parent.brain,parent.color)
        child.brain.mutate(0.1,1)
        newgen[i] = child
    }
    //loob juhuslikud objektid
    for (let i = newgen.length; i<population.length; i++) {
        newgen.push(new Shooter())
    }
    best = new Shooter(bestParent(population)) 
    best.best = true
    newgen[population.length-1]=best
    return newgen
}
//mida suurem on x astendaja, seda suurem eelis on parimatel
function fitnessFunc(x){
    return x**4
}
//kasutab crossover funktsiooni
//valitakse kaks isendit, nendest kahest juhuslikult pannakse kokku uus.
function nextCrossOverGen(population){
    population = calcFitness(population, fitnessFunc)
    let newgen = []
    let split_point = population.length-newCount
    //kasutab mutatsiooni eelmise generatsiooni peal
    for (let i = 0; i < split_point; i++) {
        let parent1 = pickParent(population)
        let parent2 = pickParent(population)
        let child_brain = crossOver(parent1.brain,parent2.brain)
        let child = new Shooter(child_brain,parent1.color)
        child.brain.mutate(0.5,0.2)//(0.1,0.1)
        newgen[i]=child
    }
    //loob juhuslikud objektid
    for (let i = newgen.length; i<population.length; i++) {
        newgen.push(new Shooter())

    }
    let best = bestParent(population)
    best = new Shooter(best.brain,best.color) 
    best.best = true
    newgen[population.length-1]=best
    return newgen
}
//laseb märki asetada sinna, kus toimus hiire klikk
canvas.addEventListener("click", function(event){
    mouseX = event.clientX - canvas.offsetLeft-10
    mouseY = event.clientY - canvas.offsetTop-10
    target.x = mouseX
    target.y = mouseY
})