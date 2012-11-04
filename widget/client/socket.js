/*var socket = io.connect(socketUrl);
socket.on('message', function (message) {
    console.log(message);
})
setInterval(function(){
    socket.emit('message', { me: 'client', mytime: new Date() });
},5000);
*/


/*var client = new function Client() {
    this.socket = null;
    this.connect = function(socketUrl) {
        if(this.socket == null) {
            this.socket = io.connect(socketUrl);
            this.socket.on('message', this.parseMessage);
        }
    };
    this.sendMessage = function(message) {
        var data = {
            client: 1,
            msg: message,
            time: new Date()
        };
        this.socket.emit('message', data);
    };
    this.parseMessage = function(data) {
        console.log(data);
    };
    this.printMessageText = function(text, from) {

    };

};*/

//client.connect('http://localhost:8080');