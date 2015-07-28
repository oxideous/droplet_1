var fs = require('fs');
var net = require('net');
var port = 3000;
var clients = 0;

var vMail = fs.readFileSync('mail.json', 'utf8');
var vMailParse = JSON.parse(vMail);
var vMailCounter = vMailParse.length;

function Message(name, msg) {
    this.id = JSON.stringify(vMailParse.length + 1);
    this.name = name;
    this.msg = msg;
}

var server = net.createServer(function (client) {
    clients++;
    console.log('client connected');
    client.write('Welcome to Textmail! There are ' + clients + ' client(s) connected right now!\r\n');
    client.write('Please enter command: messages, leaveMessage, deleteMessage, deleteAll \r\n');

    client.on('data', function (data) {
        var dataInput = data.toString().trim();
        if (dataInput === "messages") {
            client.write("Displaying Messages!");
            if (vMailParse.length <= 0) {
                client.write("There are no messages to display!");
            } else {
                for (var i = 0; i < vMailParse.length; i++) {
                    client.write("ID: " + JSON.stringify(vMailParse[i].id) + "\r\n");
                    client.write("NAME: " + JSON.stringify(vMailParse[i].name) + "\r\n");
                    client.write("MESSAGE: " + JSON.stringify(vMailParse[i].msg) + "\r\n");
                    client.write("--------------------" + "\r\n");
                }
            }
        } else if (dataInput === "leaveMessage") {
            console.log("Please Enter Your Name!");
            client.write("Please Enter Your Name!");
            client.on('data', function (name) {
                var name = name.toString().trim();
                client.write("Please Enter Your Message!");
                client.on('data', function (msg) {
                    var msg = msg.toString().trim();
                    client.write(msg);
                    var newMessage = new Message(name, msg);
                    vMailParse.push(newMessage);
                    var updatedMessages = JSON.stringify(vMailParse);
                    fs.writeFile("mail.json", updatedMessages, "utf8");
                    client.write("Added your message!");
                });
            });
        } else if (dataInput === "deleteMessage") {
            client.write("Pease enter the ID number of the message you wish to delete! Type exit to exit.");
            client.on('data', function (id) {
                var id = id;
                if (id === 'exit') {
                    client.write('Nothing deleted!')
                } else if (parseInt(id) >= 0 && parseInt(id) <= vMailParse.length) {
                    var vMailSpliced = vMailParse.splice(parseInt(id), 1);
                    fs.writeFile("mail.json", JSON.stringify(vMailParse), "utf8");
                    client.write("Message deleted!")
                } else {
                    client.write('Nothing deleted!')
                }
            });
        } else if (dataInput === "deleteAll") {
            console.log("Please enter the ID number of the message you wish to delete!");
            client.write("This will delete all messages. Type yes to proceed.");
            client.on('data', function (yes) {
                var yes = yes;
                if (yes === "yes") {
                    var vMailParse = [];
                    fs.writeFile("mail.json", JSON.stringify(vMailParse), "utf8");
                    client.write("All messages erased!");
                } else {
                    client.write("Nothing was erased!");
                }
            });
        }
    });

    client.on('end', function () {
        console.log('client disconnected');
        clients--;
    });
});

server.listen(port, function () {
    console.log('listening on ' + port);
});


//[{
//    "id": "0",
//    "name": "Spencer",
//    "msg": "Sup bro?"
//}, {
//    "id": "1",
//    "name": "Nicole",
//    "msg": "sup dude?"
//}, {
//    "id": "2",
//    "name": "Paul",
//    "msg": "Whussup brah?"
//},
// {
//     "id": "3",
//     "name": "Matt",
//     "msg": "brah?"
// },
// {
//     "id": "4",
//     "name": "Craig",
//     "msg": "!!!!!?"
// }]
