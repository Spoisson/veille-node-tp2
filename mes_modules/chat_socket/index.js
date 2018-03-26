let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    io.on('connection', function(socket){
    	console.log("socket.id" + socket.id)
    	// .......

	    socket.on('setUser', function(data){
		  		console.log(data.user);

		  		objUtilisateur[data.user] = data.user;

		  		console.log("objUtilisateur: " + objUtilisateur[data.user]);

		  		io.local.emit('ackUser', objUtilisateur);

		})

        socket.on('envoyerMessage', function(data){
                console.log(data.message);

                //objUtilisateur[data.message] = data.message;

               // console.log("objUtilisateur: " + objUtilisateur[data.message]);
                
                io.local.emit('broadcast', data.message);

        })

   	})
 return io
}

