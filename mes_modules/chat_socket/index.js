let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}

    let objCouleur = {}

    let couleurChat;

    let tableauCouleur = ['#b3ffb3', '#b3d6ff', '#beb3ff', '#fdb3ff', '#ffb3be', '#ceffb3', 
        '#f8ffb3', '#ffeab3', '#ffceb3', '#ffb3b3']; 
    io.on('connection', function(socket){
    	//console.log("socket.id" + socket.id)
    	// .......

	    socket.on('setUser', function(data){
		  		//console.log(data.user);

		  		objUtilisateur[data.id] = data.user;

		  		//console.log("objUtilisateur: " + objUtilisateur[data.id]);
                //console.log()

                let indexCouleur = Math.floor(Math.random() * tableauCouleur.length);
                couleurChat = tableauCouleur[indexCouleur];
                tableauCouleur.splice(indexCouleur, 1);
                //console.log(couleurChat);

                objCouleur[data.id + "couleur"] = couleurChat;

		  		io.local.emit('ackUser', objUtilisateur);

		})

        socket.on('envoyerMessage', function(data){
                //console.log(data.message);

                couleurChat = objCouleur[data.id + "couleur"];

                messageAvecNom = objUtilisateur[data.id] + '-     ' + data.message;

               // console.log("objUtilisateur: " + objUtilisateur[data.message]);
                
                io.local.emit('broadcast', messageAvecNom, couleurChat);

        })

   	})
 return io
}

