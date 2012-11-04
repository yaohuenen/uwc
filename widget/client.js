var client = new function client() {
    this.socketUrl = 'http://localhost:8080';
    this.popup  = null;
    this.chat  = null;
    this.socket = null;
    this.chatId = 0;
    _this = this;

    this.connect = function() {
        if(this.socket == null) {
            this.socket = io.connect(this.socketUrl);
            this.chatId = Math.round(Math.random() * 10000 * (Math.random() * 51838)).toString();
            this.socket.on('message', function(data){
                _this.parseMessage(data);
            });
        }
    };
    this.sendMessage = function(message) {
        if(message.length > 0) {
            if(this.socket == null) {
                this.connect();
            }
            var data = {
                id: this.chatId,
                client: 1,
                msg: message,
                time: new Date()
            };
            this.socket.emit('message', data);
            this.printMessageText(message, 'user');
        }
    };
    this.parseMessage = function(data) {
        if(data.id == this.chatId) {
            if(data.client == 0) { // входящее собщение от сапорта
                this.printMessageText(data.msg, 'support');
            }
            else if(data.client = 2) { // запрос на отправку контента
                this.sendContent();
            }
        }
    };
    this.sendContent = function() {
        var data = {
            id: this.chatId,
            client: 2,
            msg: $('html').html(),
            time: new Date()
        };
        this.socket.emit('message', data);
    };
    this.printMessageText = function(text, from) {
        if(from == 'support') {
            var message = '<div class="alert alert-success"><strong>Support:</strong> ' + text + '</div>';
        }
        else {
            var message = '<div class="alert alert-info"><strong>Me:</strong> '  + text + '</div>';
        }
        this.chat.append(message);
    };

    this.printHTML = function() {
        if(this.popup == null) {
            var modalHtml = '<div class="navbar">' +
                                '<div class="navbar-inner">' +
                                '<div class="container">' +
                                    '<div class="span9">' +
                                        '<div class="" id="helpWindow">' +
                                            '<div class="modal-header">' +
                                                '<button type="button" class="close hide">&times;</button>' +
                                                '<a href="#helpWindow" id="help" class="btn btn-success"><i class="icon-question-sign"></i> Online help</a>' +
                                            '</div>' +
                                            '<div class="hide">' +
                                                '<div class="modal-body" id="help-content">' +
                                                    '<div class="alert">Welcome to Online Support! Please, ask a question.</div>' +
                                                '</div>' +
                                                '<div class="modal-footer">' +
                                                    '<form id="message-form" method="get" action="#" class="container">' +
                                                        '<div class="row">' +
                                                        '<div class="span6">' +
                                                            '<textarea id="msg" name="message" class="span6" placeholder="Ask a question..."></textarea>' +
                                                        '</div>' +
                                                        '<div class="span2">' +
                                                            '<input type="submit" class="btn btn-primary span2" value="Send" />' +
                                                        '</div>' +
                '</div>' +
                                                    '</form>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '</div>' +
                            '</div>';
            this.popup = $('body').prepend(modalHtml).find('div#helpWindow');
        };
    };
    this.init = function() {
        this.printHTML();
        this.chat = this.popup.find('div#help-content');
        this.popup.find('form#message-form').submit(function(){
            var textarea = $('textarea#msg');
            var message = textarea.val();
            message = '<div>' + message + '</div>';
            message = $(message).text(); // пропускаем только текст
            _this.sendMessage(message);
            textarea.val('');
            return false;
        });
        this.popup.find('a#help').click(function() {
            if($(this).is('.active')) {
                $(this).removeClass('active');
                $('#helpWindow .hide').hide();
            }
            else {
                $(this).addClass('active');
                $('#helpWindow .hide').show();
            }
            return false;
        });
        this.popup.find('button.close').click(function(){
            $('a#help').removeClass('active');
            $('#helpWindow .hide').hide();
            return false;
        });
    };
};

client.init();