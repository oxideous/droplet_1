var net = require('net');
var port = 3001;

console.log('Listening on port ' + port);

var questions = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"]


var server = net.createServer(function (client) {
    console.log('client connected');
    client.write("Magic Eightball! Please ask a question! (Use ?)\r\n")

    client.on('data', function (data) {
        console.log(data.toString().trim())
        var input = data.toString().trim();
        console.log(input);
        var inputSearch = input.search(/\?/g);
        console.log(inputSearch);
        if (inputSearch >= 0) {
            client.write("_______________\r\n");
            client.write(questions[Math.floor(Math.random() * questions.length)] + "\r\n");
            client.write("---------------\r\n");
            client.write("Magic Eightball! Please ask a question! (Use ?)\r\n")
        } else {
            client.write("Please ask a question! (Use ?)\r\n")
        }
    });

    client.on('end', function () {
        console.log('client disconnected');
    });
});

server.listen(port, function () {
    console.log('listening on ' + port);
});
