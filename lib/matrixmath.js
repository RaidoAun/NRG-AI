/*
Koodi kirjutamisel kasutatud allikad
https://www.mathsisfun.com/algebra/matrix-introduction.html
https://en.wikipedia.org/wiki/Matrix_(mathematics)
*/


class Matrix{
    constructor(rows, cols){
        this.rows = rows
        this.cols = cols
        this.data = []
    
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0
            }
        }
    }
    randomize(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random()*2-1
            }
        }
    }
    print(){
        console.table(this.data)
    }

    static product(a,b,bool){
        let answer = new Matrix(a.rows,b.cols)
        let sum
        for (let i = 0; i < answer.rows; i++) {
            for (let j = 0; j < answer.cols; j++) {
                sum = 0
                for (let o = 0; o < a.cols; o++) {
                    sum+=a.data[i][o]*b.data[o][j]
                    
                }
                answer.data[i][j] = sum
            }
        }
        if (!bool){
            return answer
        }
        if(bool){
            return answer.MatrixtoArray()
        }
    }
    multiply(x){
        if(x instanceof Matrix){
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= x.data[i][j]
                }
            }
        }else{
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= x
                }
            }
        }

    }
    add(a){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += a.data[i][j]
            }
        }
    }
    addNum(a){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += a
            }
        }
    }
    static subtract(a,b){
        if (a.rows === b.rows && a.cols === b.cols){
            let answer = new Matrix(a.rows,a.cols)
            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) {
                    answer.data[i][j] = a.data[i][j] - b.data[i][j]
                }
            }
            return answer
        }

    }
    static transpose(a){//vaheta read ja veerud
        let answer = new Matrix(a.cols,a.rows)
        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.cols; j++) {
                answer.data[j][i] = a.data[i][j]
            }
        }
        return answer
    }
    map(f){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let x = this.data[i][j]
                this.data[i][j] = f(x)
            }
        }
    }
    static map(a,f){
        let answer = new Matrix(a.rows,a.cols)

        for (let i = 0; i < answer.rows; i++) {
            for (let j = 0; j < answer.cols; j++) {
                let x = a.data[i][j]
                answer.data[i][j] = f(x)
                
            }
        }
        
        return answer
    }
    static ArraytoMatrix(a){
        let answer = new Matrix(a.length, 1)
        for (let i = 0; i < a.length; i++) {
            answer.data[i][0] = a[i]
        }
        return answer
    }
    MatrixtoArray(){
        let a = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                a.push(this.data[i][j])
            }
        }
        return a
    }
    copy(){
        let copy = new Matrix(this.rows,this.cols)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                copy.data[i][j] = this.data[i][j]
            }
        }
        return copy
    }
}