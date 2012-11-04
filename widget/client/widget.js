var widget = new function Widget() {
    this.socketUrl = 'http://localhost:8080';
    this.button = null;
    this.modal  = null;
    this.chat  = null;
    this.socket = null;

    this.connect = function() {
        if(this.socket == null) {
            this.socket = io.connect(this.socketUrl);
            this.socket.on('message', this.parseMessage);
        }
    };
    this.sendMessage = function(message) {
        if(message.length > 0) {
            if(this.socket == null) {
                this.connect();
            }
            var data = {
                client: 1,
                msg: message,
                time: new Date()
            };
            this.socket.emit('message', data);
            this.printMessageText(message, 'user');
        }
    };
    this.parseMessage = function(data) {
        console.log(data);
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
        if(this.modal == null) {
            var modalHtml = '<div class="modal hide fade" id="helpWindow" tabindex="-1" role="dialog" aria-labelledby="Support" aria-hidden="true">'+
                                '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
                                '<h3 id="myModalLabel">Online Help</h3>'+
                            '</div>'+
                                '<div class="modal-body" id="help-content">'+
                                    '<div class="alert">Welcome to Online Support! Please, ask a question.</div>'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<form id="message-form" method="post" action="#">'+
                                        '<textarea id="msg" name="message" placeholder="Ask a question..."></textarea>'+
                                        '<input type="submit" class="btn btn-primary" value="Send" />'+
                                    '</form>'+
                                '</div>'+
                            '</div>';
            this.modal = $('body').append(modalHtml).find('div#helpWindow');
            this.chat = this.modal.find('div#help-content');
            var _this = this;
            this.modal.find('form#message-form').submit(function(){
                var textarea = $('textarea#msg');
                var message = textarea.val();
                message = '<div>' + message + '</div>';
                message = $(message).text(); // пропускаем только текст
                _this.sendMessage(message);
                textarea.val('');
                return false;
            });
        }

        if(this.button == null) {
            var buttonHtml = '<div class="navbar navbar-inverse navbar-fixed-top">'+
                                 '<div class="navbar-inner">'+
                                     '<div class="container">'+
                                        '<a href="#helpWindow" id="help" data-toggle="modal" class="btn btn-success"><i class="icon-question-sign"></i> Online help</a>'+
                                     '</div>'+
                                 '</div>'+
                             '</div>';
            this.button = $('body').append(buttonHtml).find('a#help');
        }
    };

};

widget.printHTML();