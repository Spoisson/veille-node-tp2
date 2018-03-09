var noChambre = 1;
io.on('connection', function(socket){
  //Incrémenté noChambre si plus de un clients dans la chambre.
  if(io.nsps['/'].adapter.rooms["chambre-" + noChambre ] && io.nsps['/'].adapter.rooms["chambre-" + noChambre].length > 1)
    noChambre++;
  socket.join("chambre-"+noChambre);

  // déclenche cet événement pour tous les clients de la chambre.
  io.sockets.in("chambre-" + noChambre).emit('connectAlaChambre', "Vous êtes dans la chambre numéro: " + noChambre);
})