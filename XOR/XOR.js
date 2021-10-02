let nn = new Neural_Network(2, [5], 1)
nn.randomize_weights()
nn.learning_rate = 0.1
for (let i = 0;i<30000;i++){
    nn.train([0,0],[0])//sisenditeks [0,0], väljundiks [0]
    nn.train([0,1],[1])//sisenditeks [0,1], väljundiks [1]
    nn.train([1,0],[1])//sisenditeks [1,0], väljundiks [1]
    nn.train([1,1],[0])//sisenditeks [1,1], väljundiks [0]
}
console.log(nn.feed_forward([0,0]))
console.log(nn.feed_forward([0,1]))
console.log(nn.feed_forward([1,0]))
console.log(nn.feed_forward([1,1]))

