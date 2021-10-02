class bird{
    constructor(brain,color){
        this.x = canvas.width/4;
        this.y = canvas.height/3;
        this.w = 20;
        this.h = 20;
        this.r = 10
        this.speed = 0;
        this.objectp={x: this.x, y: this.y, width: this.w, height: this.h};
        this.objectpscore={x: this.x+this.w, y: this.y, width: 1, height: this.h}
        this.alive = true;
        this.score = 0;
        this.fitness = 0;
        this.closest = null
        this.best = false
        if (brain){
            this.brain = brain.copy()
            this.color = color;
        }else{
            this.brain = new Neural_Network(5, [16], 2)
            this.brain.randomize_weights()
            this.color = 'rgba(' + Math.random()*255 + ', ' +Math.random()*255 + ', '+ Math.random()*255+', '+ 0.4+')'
            
        }
    }
    update() {
        if (this.alive){
            this.speed+=0.2;
            if (this.y+this.h>canvas.height){
                this.alive = false;
            }
            else{
                this.y += this.speed;
            }
            this.objectp = {x: this.x, y: this.y, width: this.w, height: this.h}
            this.objectpscore = {x: this.x+this.w, y: this.y, width: 1, height: this.h}
        }
    }
    draw(){
        if (this.alive){
            ctx.strokeStyle = "black"
            if (this.best){
                //võimalus panna parima värv punaseks
                //ctx.fillStyle = "red";
                
            }else{
                ctx.fillStyle = this.color;
            }
            ctx.beginPath()
            ctx.arc(this.x+this.w/2, this.y+this.h/2, this.r, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
        }
    }
    jump(){
        let inputs = []
        inputs.push(this.y)
        inputs.push(this.speed)
        inputs.push(this.closest.x)
        inputs.push(this.closest.h)
        inputs.push(this.closest.y2)
        /*
        //võimalus näha punkte, mida linnud "näevad"
        ctx.fillStyle = "red"
        ctx.fillRect(this.closest.x,this.closest.h,10,10)
        ctx.fillRect(this.closest.x,this.closest.y2,10,10)
        */
        //närvivõrk pakub oma vastust antud sisenditele
        let guess = this.brain.feed_forward(inputs)
        if (guess[0]>guess[1]){//kui otsus hüpata on suurema arvuga, kui otsus mitte hüpata, siis hüppab
            this.speed=-5
        }
    }
}