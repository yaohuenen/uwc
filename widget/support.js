var support = new function Support() {
    this.socketUrl = 'http://localhost:8080';
    this.button = null;
    this.chat  = null;
    this.socket = null;
    this.table = null;
    this.users = new Array();
    this.currentUser = 0;
    this.history = new Object();
    this.chat = $('div#help-content');

    this.connect = function() {
        if(this.socket == null) {
            this.socket = io.connect(this.socketUrl);
            this.socket.on('message', function(data){
                support.parseMessage(data);
            });
        }
    };
    this.sendMessage = function(message, userId) {
        if(message.length > 0) {
            if(this.socket == null) {
                this.connect();
            }
            var data = {
                id: this.currentUser,
                client: 0,
                msg: message,
                time: new Date()
            };
            this.socket.emit('message', data);
            this.printMessageText(message, 'support', this.currentUser);
        }
    };
    this.sendClick = function(x, y) {
        if(this.socket == null) {
            this.connect();
        }
        var data = {
            id: this.currentUser,
            client: 3,
            mx: x,
            my: y,
            time: new Date()
        };
        this.socket.emit('message', data);
    };
    this.addUser = function(id) {
        this.users.push(id);
        this.history[id] = '';
        this.table.find('tbody').prepend('<tr class="success user_' + id + '" data-id="' + id + '"><td>' + this.users.length + '</td><td class="status">New</td></tr>');
    };
    this.openChat = function(id) {
        $('#helpWindow .hide').show();
        this.table.find('tr.user_' + this.currentUser).removeClass('info').removeClass('success').find('.status').text('Closed');
        this.currentUser = id;
        this.table.find('tr.user_' + this.currentUser).removeClass('success').addClass('info').find('.status').text('In Chat!');
        this.chat.html(this.history[this.currentUser]);
        $('#user-body').addClass('hide').find('iframe').contents().find('body').empty();
    };
    this.closeChat = function() {
        this.table.find('tr.user_' + this.currentUser).removeClass('success').removeClass('info').find('.status').text('Closed');
        this.chat.empty();
        this.currentUser = 0;
        $('#helpWindow .hide').hide();
        $('#helpWindow a.btn.user').removeClass('active');
        $('#user-body').addClass('hide').find('iframe').contents().find('body').empty();
    };
    this.parseMessage = function(data) {
        if(data.client == 1) {
            if(this.users.indexOf(data.id) == -1) {
                this.addUser(data.id);
            }
            this.printMessageText(data.msg, 'user', data.id);
        }
        else if(data.client == 2) {
            $('#user-body').removeClass('hide')
                           .find('iframe')
                           .width(data.width)
                           .contents()
                           .find('body')
                           .html(data.html)
                            .find('*')
                           .unbind('click')
                           .click(function(e) {
                                parent.window.support.sendClick(e.pageX, e.pageY);
                                return false;
                           });
        }
    };
    this.printMessageText = function(text, from, userId) {
        if(from == 'user') {
            var message = '<div class="alert alert-success"><strong>User:</strong> ' + text + '</div>';
        }
        else {
            var message = '<div class="alert alert-info"><strong>Me:</strong> '  + text + '</div>';
        }
        this.history[userId] += message;
        if(this.currentUser == userId) {
            this.chat.append(message);
        }
        else {
            this.table.find('tr.user_' + userId).removeClass('info').addClass('success').find('.status').text('New');
        }
    };
    this.getUserContent = function() {
        var data = {
            id: this.currentUser,
            client: 2,
            time: new Date()
        };
        this.socket.emit('message', data);
    };
    this.init = function() {
        $('form#message-form').submit(function(){
            var textarea = $('textarea#msg');
            var message = textarea.val();
            message = '<div>' + message + '</div>';
            message = $(message).text(); // пропускаем только текст
            support.sendMessage(message);
            textarea.val('');
            return false;
        });
        $('#helpWindow button.close').click(function() {
            support.closeChat();
            return false;
        });
        $('#show-viewport').click(function() {
            support.getUserContent();
            return false;
        });
        this.table = $('#userlist');
        this.table.on('click', 'tr', function(){
            support.openChat($(this).attr('data-id'));
        });
        this.connect();
    };
};

support.init();