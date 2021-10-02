/*
Koodi kirjutamisel oli abiks
https://towardsdatascience.com/how-to-build-your-own-neural-network-from-scratch-in-python-68998a08e4f6
https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb
https://www.youtube.com/watch?v=ILsA4nyG7I0
https://www.youtube.com/watch?v=JeVDjExBf7Y
*/
//sigmoid on üks funktsioonidest, mida kasutatakse närvivõrkude jaoks.
function sigmoid(x) {//muutumispiirkond on 0 kuni 1 https://en.wikipedia.org/wiki/Sigmoid_function
    console.log()
    return 1 / (1 + Math.exp(-x))
}
function dsigmoid(x) {//sigmoidi tuletis
    return x * (1 - x)
}
function randn_bm() {//random, kus paljud numbrid on lähedal keskmisele punktile
    let u = 0, v = 0;
    while(u === 0) {
        u = Math.random()
    };
    while(v === 0) {
        v = Math.random()
    };
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0){
        return randn_bm()
    };
    return num;
}
class activationFunc{
    constructor(f, df){//f on funktsioon ja df selle tuletis
        this.f =f
        this.df = df//tuletist on ainult vaja, kui kasutatakse train() funktsiooni. (backpropagation)
    }
}
class Neural_Network {
    constructor(input_nodes, hidden_layers, output_nodes) {//hidden layers on list []
        if (input_nodes instanceof Neural_Network){//kui soovitakse luua koopia vanast, anti sisse juba loodud Neural_Network
            let old = input_nodes 
            this.activation_func = old.activation_func
            this.learning_rate = old.learning_rate
            this.input_nodes = old.input_nodes
            this.hidden_layers = old.hidden_layers
            this.output_nodes = old.output_nodes
            this.layers_weights = []
            this.bias_arr = []
            for (let i = 0;i<old.layers_weights.length;i++){
                this.layers_weights[i] = old.layers_weights[i].copy()
            }
            for (let i = 0;i<old.bias_arr.length;i++){
                this.bias_arr[i] = old.bias_arr[i].copy()
            }
        }else{//kui ei ole koopia loomine, vaid uue loomine
        this.activation_func = new activationFunc(sigmoid,dsigmoid)
        let bias
        this.input_nodes = input_nodes
        this.hidden_layers = hidden_layers
        this.output_nodes = output_nodes

        this.layers_weights = []
        //luuakse Matrix objektid, mille suurus oleneb Neural_Network objektist
        this.layers_weights.push(new Matrix(this.hidden_layers[0], this.input_nodes))
        for (let i = 0; i < this.hidden_layers.length - 1; i++) {
            let weights = new Matrix(this.hidden_layers[i + 1], this.hidden_layers[i])
            this.layers_weights.push(weights)

        }
        let last_weight = new Matrix(this.output_nodes,this.hidden_layers[this.hidden_layers.length - 1])     
        this.layers_weights.push(last_weight)
        //vabaliikmete list luuakse sarnaselt eelnevale
        this.bias_arr = []
        for (let i = 0; i < hidden_layers.length; i++) {
            bias = new Matrix(this.hidden_layers[i], 1)
            this.bias_arr.push(bias)
        }
        bias = new Matrix(this.output_nodes, 1)
        this.bias_arr.push(bias)
        this.learning_rate = 0.1
        }
    }
    randomize_weights() { //annab võimaluse iga raskus juhuslikult valida number tuleb -1 kuni 1
        for (let i = 0; i < this.layers_weights.length; i++) {
            this.layers_weights[i].randomize()
        }
        for (let i = 0; i < this.bias_arr.length; i++) {
            this.bias_arr[i].randomize()
            
        }
    }
    feed_forward(input){//Antakse ette sisendid ja närvivõrk pakub oma vastust (sisendid on list [])
        //tehete tegemiseks tuleb list teha ümber Matrix objektiks
        let inputs = Matrix.ArraytoMatrix(input)
        let weighted_sum = []
        let last_sum

        last_sum = Matrix.product(this.layers_weights[0], inputs)
        last_sum.add(this.bias_arr[0])
        //normaliseeritakse väärtused kasutades üldjuhul sigmoid funktsiooni
        last_sum.map(this.activation_func.f)
        
        weighted_sum.push(last_sum)
        
        for (let i = 1; i < this.hidden_layers.length + 1; i++) {
            last_sum = Matrix.product(this.layers_weights[i], last_sum)
            last_sum.add(this.bias_arr[i])
            last_sum.map(this.activation_func.f)
            weighted_sum.push(last_sum)

        }
        
        let outputs = weighted_sum[weighted_sum.length - 1]
        return outputs.MatrixtoArray()//return tagastab listi []
    }
    train(input, targets) {
        //algus on sisult sama feed_forward funktsiooniga, aga lõpus kasutatakse ette antud vastust, et muuta raskuseid (backpropagation)
        //sobib juhendamisega õppe jaoks
        let inputs = Matrix.ArraytoMatrix(input)
        let weighted_sum = []
        let last_sum

    
        last_sum = Matrix.product(this.layers_weights[0], inputs)
        last_sum.add(this.bias_arr[0])
        
        last_sum.map(this.activation_func.f)
        
        weighted_sum.push(last_sum)
        
        for (let i = 1; i < this.hidden_layers.length + 1; i++) {
            last_sum = Matrix.product(this.layers_weights[i], last_sum)
            last_sum.add(this.bias_arr[i])
            last_sum.map(this.activation_func.f)
            weighted_sum.push(last_sum)

        }
        
        let outputs = weighted_sum[weighted_sum.length - 1]
        
        
        targets = Matrix.ArraytoMatrix(targets)
        let errors = []
        //leitakse vea suurused
        let error = Matrix.subtract(targets, outputs)
        errors.push(error)

        for (let i = 1; i < this.hidden_layers.length + 1; i++) {
            error = Matrix.product(Matrix.transpose(this.layers_weights[this.layers_weights.length - i]), error)
            errors.push(error)
        }
        //backpropagation
        //lühidalt: olenevalt vea suurusest proovitakse viga üles leida ja muudetakse kihtide raskuseid.
        //https://www.youtube.com/watch?v=Ilg3gGewQ5U&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&index=4&t=0s
        let out = 0
        let gradients = 0
        let inp = 0
        let delta = 0
        let weight = 0
        let bias = 0
        for (var i = 1; i < this.layers_weights.length; i++) {
            out = weighted_sum[weighted_sum.length - i]
            gradients = Matrix.map(out,this.activation_func.df)
            gradients.multiply(errors[i-1])
            gradients.multiply(this.learning_rate)
            
            inp = weighted_sum[weighted_sum.length-(i+1)]
            delta = Matrix.product(gradients,Matrix.transpose(inp))
            weight = this.layers_weights[this.layers_weights.length-i]
            bias = this.bias_arr[this.bias_arr.length-i]
            weight.add(delta)
            bias.add(gradients)
        }
        
        out = weighted_sum[0]
        gradients = Matrix.map(out,this.activation_func.df)
        gradients = Matrix.product(gradients,errors[1])
        gradients.multiply(this.learning_rate)
        let inputs_T = Matrix.transpose(inputs)
        delta = Matrix.product(gradients,inputs_T)
        bias = this.bias_arr[0]
        weight = this.layers_weights[0]
        weight.add(delta)
        bias.add(gradients)
        return outputs.MatrixtoArray()//väljastatakse list []
    }
    copy(){//laseb luua koopia
        return new Neural_Network(this)
    }

    mutate(rate,size=0.2, func = function(value){//tihti aitab ainult rate muutuja muutmine, mis on võimalus muutumiseks
        if (Math.random()<rate){
            return value+(randn_bm()*size-size/2)
        }
        else{
            return value
        }
    }){
        //jooksuta func funktsiooni raskuste peal
        for (let i = 0; i < this.layers_weights.length; i++) {
            this.layers_weights[i].map(func)
        }
        for (let i = 0; i < this.bias_arr.length; i++) {
            this.bias_arr[i].map(func)
        }
    }
}