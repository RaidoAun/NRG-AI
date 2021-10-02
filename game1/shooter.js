class Shooter{
    constructor(brain,color){
        this.score = 0
        this.fitness = 0
        this.time = 0
        
        if (brain){
            this.brain = brain.copy()
            this.color = color
            this.shoot()
        }else{
            this.brain = new Neural_Network(2, [6], 2)
            this.brain.randomize_weights()
            this.color = 'rgb(' + Math.random()*255 + ', ' +Math.random()*255 + ', '+ Math.random()*255+')'
            this.shoot()
        }
    }
    shoot() {
        let inputs = []
        //inputs.push(calcDistance(player.x,player.y,target.x,target.y)) //annab sisendiks kauguse mängija ja märgi vahel
        //inputs.push(calcAngle(player.x,player.y,target.x,target.y)) //annab sisendiks nurga mängija ja märgi vahel
        inputs.push(target.x)
        inputs.push(target.y)
        let guess = this.brain.feed_forward(inputs)
        let angle = (guess[0]*110)-10
        let power = guess[1]*15
        this.bullet = new bulletGen(player.x + playerHeight / 2, player.y, bulletSize, this.color, power, angle)
    }
    updateBullet(){
        if (this.bullet.alive) {
            this.bullet.update()
            if (this.bullet.x < 0 || this.bullet.x > canvas.width || this.bullet.y > canvas.height || this.bullet.y<-(canvas.height/2)) {
                this.bullet.alive = false
            }
            if (RectCircleColliding(this.bullet, target, 0)) {
                this.bullet.alive = false
                //võimalusel saab kuuli kauguse muutujat tabamisel muuta, et tabamine oleks tähtsam.
                //distance muutujast sõltub ka score, millest sõltub fitness ehk võimalus pääseda edasi uude generatsiooni
                //this.bullet.distance = 0
                bullet_hit_target = true
            }
        }
        if (!this.bullet.alive&&!this.bullet.scored){
            this.score+= maxDist - this.bullet.distance
            this.bullet.scored = true
        }
        
    }
    drawBullet(){
        this.bullet.draw()
    }
}





class bulletGen{
    constructor(x,y,r,color,power,angle){
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.speed = 0
        this.gravity = 0.1
        this.alive = true
        this.distance = maxDist
        this.scored = false
        this.power = power
        this.angle = angle
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fill()
    }
    update(){
        this.speed += this.gravity
        let newDist = calcDistance(this.x, this.y, target.x + targetSize / 2, target.y + targetSize / 2) - bulletSize
        if (this.distance > newDist){
            this.distance = newDist 
        }
        this.x -= Math.cos(this.angle * Math.PI / 180) * this.power
        this.y -= Math.sin(this.angle * Math.PI / 180) * this.power - this.speed
    }
}
