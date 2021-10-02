let canvas = document.createElement("canvas");
let scoretext = document.createElement("p");
let best_scoretext = document.createElement("p");
let current_gentext = document.createElement("p");
let alivecounttext = document.createElement("p");
let form1 = document.getElementById("frm1")
ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;
document.body.appendChild(canvas);
document.body.appendChild(scoretext);
document.body.appendChild(best_scoretext);
document.body.appendChild(current_gentext);
document.body.appendChild(alivecounttext);
let gap = 100; //vahe ülemise ja alumise toru vahel
let gap2 = 0.75;//vahe toru paaride vahel
let pause = false;
let score = 0;
let bestscore = 0;
let generation = 0;
let timer = 0;
let pipes=[]
let birds = [];
//lindude arv, kes korraga mängivad
let birdcount = 400;
let SPEED = 1
let alivecount = birdcount
scoretext.innerText = "Score: "+score
best_scoretext.innerText = "Best Score: "+bestscore
current_gentext.innerText = "Generation: "+generation
alivecounttext.innerText = "Alive: "+alivecount
startgame();
//mängu loop
function frameupdate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ekraanile joonistamine
    for (let i = 0; i < birdcount; i++) {
        birds[i].draw()
    }
    for (let i = 0;i < pipes.length;i++){
        pipes[i].draw()
    }
    //mängu loogika, teeb seda SPEED korda, siin ei ole joonistamist.
    for (let i = 0; i < SPEED; i++) {
        
        for (let i = 0;i < pipes.length;i++){
            pipes[i].update()
        }
        for (let j = 0; j < birdcount; j++) {
            if (birds[j].alive){
                //leiab lähima toru koordinaadid
                let closest_dist = Infinity
                for (let i = 0;i < pipes.length;i++){
                    let d = pipes[i].x-birds[j].x
                    if (closest_dist>d && d>-50){
                        closest_dist = d
                        birds[j].closest = pipes[i]                                   
                    }
                    //kontrollib, kas lind puudutab toru
                    isCollided = contains(birds[j].objectp, pipes[i].object1)
                    isCollided2 = contains(birds[j].objectp, pipes[i].object2)
                    //kui lind puudutab toru, siis on lind surnud
                    if (isCollided || isCollided2){
                        birds[j].alive = false
                    }
                }
                birds[j].score+=1;
            }
        }
        let deadcount = 0
        //elus olevate lindude loogikat jooksutatakse ja loetakse surnud kokku
        for (let i = 0; i < birdcount; i++) {
            if (birds[i].alive){
                birds[i].update()
                birds[i].jump()
            }
            if (!birds[i].alive){
                deadcount ++
            }
        }
        //kui elusate arv on muutnud
        if (alivecount > birdcount-deadcount){
            alivecount = birdcount-deadcount
            alivecounttext.innerText = "Alive: "+alivecount
        }
        //kui kõik linnud on surnud
        if (deadcount == birdcount){
            pipes = []
            for (let i = 0; i < 2; i++){
                pipes.push(new pipe(canvas.width*(i*gap2+1),
                30,
                getRndInteger(canvas.height*0.1,canvas.height*0.8),
                gap,
                "green"))
            }
            alivecount = birdcount
            alivecounttext.innerText = "Alive: "+alivecount
            best_scoretext.innerText = "Best Score: "+bestscore
            score = 0
            scoretext.innerText = "Score: "+score
            generation+=1
            current_gentext.innerText = "Generation: "+generation
            //uus generatsioon
            //valida kumbki uue generatsiooni funktsioonidest
            //birds = nextGen(birds)
            birds = nextCrossOverGen(birds)
        }
    }

    
window.requestAnimationFrame(frameupdate);
}
function changeSpeed(){
    SPEED=readInput()[0]
}
function changeSpeedtoOne(){
    SPEED = 1
}
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
//mängu alustamine
function startgame () {
    //luuakse linnud ja pannakse listi
    for (let i = 0; i < birdcount; i++) {
        birds[i] = new bird();
        
    }
    //luuakse torud
    for (let i = 0; i < 2; i++){
        pipes.push(new pipe(canvas.width*(i*gap2+1),
        30,
        getRndInteger(canvas.height*0.1,canvas.height*0.8),
        gap,
        "green"))
    }
    window.requestAnimationFrame(frameupdate);

}

function contains(targetA, targetB) {
    
    return !(targetB.x > (targetA.x + targetA.width) || 
             (targetB.x + targetB.width) < targetA.x || 
             targetB.y > (targetA.y + targetA.height) ||
             (targetB.y + targetB.height) < targetA.y);
  }

//toru klass, võib olla ka kirjas nii: class toru{constructor(x,y,h,gap,color)}
function pipe(x,w,h,gap,color){
    this.x = x;
    this.w = w;
    this.h = h;
    this.gap = gap;
    this.color = color;
    this.speed = 2;
    this.object1={}
    this.object2={}
    this.objectscore={}
    this.update = function(){
        //kui toru on jõudnud vasakusse äärde läheb see paremale tagasi
        if (this.x+this.w<0){
            this.x=canvas.width*2*0.7
            this.h=getRndInteger(canvas.height*0.2,canvas.height*0.7)
        }
        else{
            //uuendab skoori
            if (this.x === canvas.width/4){
                score+=1
                if (score > bestscore){
                    bestscore = score
                    best_scoretext.innerText = "Best Score: "+bestscore
                }
                scoretext.innerText = "Score: "+score
            }
            this.x-=this.speed;
        }
        //arvutab toru asukoha
        this.y2=this.h+this.gap;
        this.h2=canvas.height-(this.h+this.gap);
        this.object1 = {x: this.x, y: 0-canvas.height*10, width: this.w, height: this.h+canvas.height*10};
        this.object2 = {x: this.x, y: this.y2, width: this.w, height: this.h2};
        this.objectscore={x: this.x+this.w, y: 0, width: 1, height: canvas.height};

    }
    //toru joonistamine
    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0-canvas.height, this.w, this.h+canvas.height);
        ctx.fillRect(this.x,this.y2,this.w,this.h2);
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
//tasub vaadata evolution.js faili lib kaustas
//ei kasuta crossover funktsiooni
//valitakse üks isend, muudetakse ja otse uude generatsiooni
function nextGen(population){
    population = calcFitness(population, fitnessFunc)
    let newgen = []
    let split_point = population.length/4
    for (let i = 0; i < split_point; i++) {
        let parent = pickParent(population)
        let child = new bird(parent.brain,parent.color)
        child.brain.mutate(0.05)
        newgen[i] = child
    }
    for (let i = newgen.length; i<population.length; i++) {
        newgen.push(new bird())
    }
    let best = bestParent(population)
    best = new bird(best.brain,best.color) 
    newgen[population.length-1]=best
    return newgen
}
//kasutab crossover funktsiooni
//valitakse kaks isendit, nendest kahest juhuslikult pannakse kokku uus.
function nextCrossOverGen(population){
    population = calcFitness(population, fitnessFunc)
    let newgen = []
    let split_point = population.length/4
    for (let i = 0; i < split_point; i++) {
        let parent1 = pickParent(population)
        let parent2 = pickParent(population)
        let child_brain = crossOver(parent1.brain,parent2.brain)
        let child = new bird(child_brain,parent1.color)
        child.brain.mutate(0.05,0.1)
        newgen[i]=child
    }
    for (let i = newgen.length; i<population.length; i++) {
        newgen.push(new bird())
    }
    let best = bestParent(population)
    best = new bird(best.brain,best.color) 
    best.best = true
    newgen[population.length-1]=best
    return newgen
}
//mida suurem on x astendaja, seda suurem eelis on parimatel
function fitnessFunc(x){
    return x**5
}