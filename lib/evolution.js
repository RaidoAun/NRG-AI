/*
https://www.youtube.com/watch?v=VnwjxityDLQ //lühike selgitus
https://www.youtube.com/watch?v=9zfeTw-uFCw&list=PLRqwX-V7Uu6bJM3VgzjNV5YxVxUwzALHV //Playlist pika selgitusega ja näidetega
https://www.youtube.com/watch?v=lu5ul7z4icQ&list=PLRqwX-V7Uu6Yd3975YwxrR0x40XGJ_KGO //Flappy birdi rakendamise üks näide (playlist)
*/
function calcFitness(population,func = function(a){return a}){
    let sum=0
    newpop = population
    for (let i = 0; i < population.length; i++) {
        sum+=func(population[i].score)
    }
    for (let i = 0; i < population.length; i++) {
        newpop[i].fitness=func(population[i].score)/sum
    }
    return newpop
}
function pickParent(population){
    let i = 0
    let r = Math.random()
    while (r>0){
        r = r-population[i].fitness
        i++
    }
    i--
    let parent = population[i]
    return parent
}

function bestParent(population) {
    let temp;
    let best = population[0];
    for (let i = 1; i < population.length; i++) {
        temp = population[i];
        if (temp.fitness > best.fitness) {
            best = temp;
        }
    }
    return best;
}

function crossOver(brain1,brain2){
    let child_brain = brain1.copy()
    for (let i = 0; i < brain1.layers_weights.length; i++) {
        for (let j = 0; j < brain1.layers_weights[i].rows; j++) {
            for (let k = 0; k < brain1.layers_weights[i].cols; k++) {
                if(Math.random()<0.5){
                    child_brain.layers_weights[i].data[j][k]=brain2.layers_weights[i].data[j][k]
                }
            }
        }
    }
    return child_brain
}

