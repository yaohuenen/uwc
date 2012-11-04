var client = new function Client() {
    this.socketUrl = 'http://localhost:8080';
    this.popup  = null;
    this.chat  = null;
    this.socket = null;
    this.chatId = 0;

    this.connect = function() {
        if(this.socket == null) {
            this.socket = io.connect(this.socketUrl);
            this.chatId = Math.round(Math.random() * 10000 * (Math.random() * 51838)).toString();
            this.socket.on('message', function(data){
                client.parseMessage(data);
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
            else if(data.client == 2) { // запрос на отправку контента
                this.sendContent();
            }
            else if(data.client == 3) { // координаты клика
                this.showClick(data.mx, data.my);
            }
        }
    };
    this.showClick = function(x, y) {
        if($('#clickAnimation').size() == 0) {
            $('body').append('<div id="clickAnimation" style="display: none"></div>');
        }
        var _x = parseInt(x) - 30;
        var _y = parseInt(y) - 30 + $('#client-widget').outerHeight(true);
        $('#clickAnimation').stop(false, true).css({left: _x + 'px', top: _y + 'px'}).fadeIn(400, function(){
            $(this).fadeOut(400);
        });
    };
    this.sendContent = function() {
        var html = $('body').clone().find('#client-widget').remove().end().html();
        var data = {
            id: this.chatId,
            client: 2,
            html: html,
            width: $(window).width(),
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
            var modalHtml = '<div class="navbar" id="client-widget">' +
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
            this.popup = $('body.client').prepend(modalHtml).find('div#helpWindow');
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
            client.sendMessage(message);
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