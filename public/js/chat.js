//public/js/chat.js
//uses jquerry and socket.io
//also uses userData from routes.js->render ejs->javascript variable: userData

//Erst starten wenn die Seite fertig geladen ist
$(document).ready(function(){
	//socket.io client registers the user
	//var socket = io();
	//The query member of the options object is passed to the server on connection and parsed as a CGI style Querystring.
	var querystring = 'userID='+userID+'&username='+username+'&defaultRoom='+defaultRoom+'&chatColor='+chatColor+'&gameID='+gameID;
	var socket = io({ query: querystring });

	//join default room at start of connection
	if(defaultRoom === undefined){
		defaultRoom = 'default';
	}

	//initiate the chat
	socket.on('connect', function(){

		if(gameID){
			console.log('user '+username+'(you) connected to game '+gameID);
			socket.emit('initGameChat', gameID);
		} else {
			console.log('user '+username+'(you) connected to chatroom '+defaultRoom);
			socket.emit('initLoungeChat');
			socket.emit('joinRoom', userID, defaultRoom);
			$('#roomHeader').text('Room: '+defaultRoom);
		}

	});

	//Send chat message
	$('#chatForm').submit(function(){
		var msg = $('#message').val();
		//If message is empty: abort
		if(msg === ''){
			return false;
		}
		//console.log(user);
		socket.emit('chat-message', msg);
		$('#message').val('');
		return false;
	});

	//Receive chat message
	socket.on('chat-message', function(user, msg, color){
		var chat_container = $('#chat_messages');

		var chatMessage = $('<li>');
		chatMessage.text(user+': '+msg);
		chatMessage.css('background-color', color);
		$('#chat_messages').append(chatMessage);

		//if the chat is scrolled to the bottom, scroll back to the bottom after adding the message
		if(chat_container.scrollTop() + chat_container.height() !== chat_container[0].scrollHeight){
			chat_container.scrollTop(chat_container[0].scrollHeight);
		}

	})

	//Changing rooms
	$('#roomForm').submit(function(){

		var chatroom = $('#roomName').val();
		if(chatroom === ''){
			return false;
		}

		$('#roomHeader').text('Room: '+chatroom);

		socket.emit('joinRoom', userID , chatroom);

		$('#roomName').val('');

		//no page reload
		return false;
	})

	//Add user to user list
	socket.on('userUpdate', function(add, username){
		if(add){
			$('#chat_users').append(createUser(username));
		} else {
			console.log('trying to remove chatuser_'+username)
			$('#chat_users').remove($('#chatuser_'+username));
		}
	});

	socket.on('userList', function(list){
		var chat_users = $('#chat_users');
		chat_users.empty();
		for(var i = 0; i<list.length; i++){
			//create list element for every user
			//console.log('element: '+list[i]);
			chat_users.append(createUser(list[i]));
		}
		//console.log(list);
	});

	socket.on('playerList', function(list){
		var players = $('#playerList');
		players.empty();
		for(var i = 0; i<list.length; i++){

		}
	});

	//If the user is disconnected
	socket.on('disconnectedChat', function(){

	});

	socket.on('test', function(data){
		console.log(data);
	});

	socket.on('gameUpdate', function(add, game){
		console.log('someone created a new game');
		var gameList = $('#gameList');
		if(add){
			gameList.append(createGame(game));
		} else {
			gameList.remove($('#game_'+game._id));
		}
	});

	//creates list element to show in user list
	function createUser(username){
		var user = $('<li>');
		user.text(username);
		user.attr('id', 'chatuser_'+username);

		return user;
	}

	//creates list element to show in playerList
	function createPlayer(username){
		var player = $('<li>');
		user.text(username);
		user.attr('id', 'player_'+username);

		return player;
	}

	//creates list element to show in gameList
	function createGame(game){
		var game = $('<li>');
		user.text(game.name);
		user.attr('id', 'game_'+game._id);

		return game;
	}

});
