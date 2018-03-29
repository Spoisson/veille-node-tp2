const express = require('express');
const http = require('http');
const fs = require('fs')
const util = require("util");


const app = express();

const server = http.Server(app);

const io = require('./mes_modules/chat_socket').listen(server);

//io.on('connection', function(){ /* … */ });
//server.listen(3000);



app.use(express.static('public'));

const peupler = require('./mes_modules/peupler')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient // le pilote MongoDB
const ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const i18n = require('i18n');
const cookieParser = require('cookie-parser');
app.use(cookieParser());


i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' })

app.use(i18n.init);

/* on associe le moteur de vue au module «ejs» */


//socket.emit('user_valide', data) // émettre vers le socket actif




let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')

// lancement du serveur Express sur le port 8081
 server.listen(8081, (err) => {
 if (err) console.log(err)
 let host = server.address().address
 let port = server.address().port 
 console.log('connexion à la BD et on écoute sur le port ' + port)
 })
})


/*
Les routes
*/

////////////////////////////////////////// Route /
app.set('view engine', 'ejs'); // générateur de template

app.get('/', function (req, res) {
      
 res.render('accueil.ejs')  
 
  });



//////////////////////////////////////////
app.get('/:local(en|fr)', function (req, res) {

	//console.log(req.params.local);
	res.cookie('langueChoisie' , req.params.local);
	res.setLocale(req.params.local);
	//console.log(res.__('courriel'));

 	res.render('accueil.ejs');

 //res.render('accueil.ejs')  
 
  });




//////////////////////////////////////////
app.get('/', function (req, res) {

 	//console.log("req.cookies.langueChoisie = " + req.cookies.langueChoisie);
 	if(req.cookies.langueChoisie){

 		res.setLocale(req.cookies.langueChoisie);

 	}

 	//res.setLocale(req.cookies.langueChoisie);
 	//console.log(res.__('courriel'));
 	//console.log(langueEnCours);
 	res.render('accueil.ejs');
 
  });



//////////////////////////////////////////  Route Adresse
app.get('/adresse', function (req, res) {
   var cursor = db.collection('adresse')
                .find().toArray(function(err, resultat){
 if (err) return console.log(err)        
 res.render('adresse.ejs', {adresses: resultat})   
  });
})
//////////////////////////////////////////  Route Rechercher
app.post('/rechercher',  (req, res) => {

})
////////////////////////////////////////// Route /ajouter
app.post('/ajouter', (req, res) => {
console.log('route /ajouter')	
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 // console.log(req.body)	
 console.log('sauvegarder dans la BD')
 res.redirect('/adresse')
 })
})

////////////////////////////////////////  Route /modifier
app.post('/modifier', (req, res) => {
console.log('route /modifier')
// console.log('util = ' + util.inspect(req.body));
req.body._id = 	ObjectID(req.body._id)
 db.collection('adresse').save(req.body, (err, result) => {
	 if (err) return console.log(err)
	 console.log('sauvegarder dans la BD')
	 res.redirect('/adresse')
	 })
})


////////////////////////////////////////  Route /detruire
app.get('/detruire/:id', (req, res) => {
 console.log('route /detruire')
 // console.log('util = ' + util.inspect(req.params));	
 var id = req.params.id
 console.log(id)
 db.collection('adresse').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

	if (err) return console.log(err)
	res.redirect('/adresse')  // redirige vers la route qui affiche la collection

 })
})


///////////////////////////////////////////////////////////   Route /trier
app.get('/trier/:cle/:ordre', (req, res) => {

 let cle = req.params.cle
 let ordre = (req.params.ordre == 'asc' ? 1 : -1)
 let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){

  ordre = (req.params.ordre == 'asc' ? 'desc' : 'asc')  
 res.render('adresse.ejs', {adresses: resultat, cle, ordre })	
})

}) 


/////////////////////////////////////////////////////////  Route /peupler
app.get('/vider', (req, res) => {

	let cursor = db.collection('adresse').drop((err, res)=>{
		if(err) console.error(err)
			console.log('ok')
			
		})
	res.redirect('/adresse')
})


app.post('/ajax_modifier', (req,res) => {

	//console.log('route /ajax_modifier')
	// console.log('util = ' + util.inspect(req.body));
	req.body._id = 	ObjectID(req.body._id)
	//console.log('req.body._id = ' + req.body._id)
	//console.log(req.body);
 	db.collection('adresse').save(req.body, (err, result) => {

		if (err) return console.log(err)
		//console.log('sauvegarder dans la BD')
		//console.log(res);
		//console.log(res.send);
		res.send(JSON.stringify(req.body))

	})

})

app.post('/ajax_detruire', (req,res) => {

	//console.log('route /ajax_modifier')
	// console.log('util = ' + util.inspect(req.body));
	req.body._id = 	ObjectID(req.body._id)
	//console.log('req.body._id = ' + req.body._id)
	//console.log(req.body);


	db.collection('adresse').findOneAndDelete({"_id": req.body._id}, (err, resultat) => {

		if (err) return console.log(err)
		//console.log('retiré de la BD')
		//console.log(JSON.stringify(req.body));
		//res.send(JSON.stringify(req.body))
		res.send(req.body._id);
		//res.redirect('/adresse')
		//res.redirect('#')  // redirige vers la route qui affiche la collection

 	})

})



app.post('/ajax_ajouter', (req,res) => {

	console.log('route /ajouter')	
	 db.collection('adresse').save(req.body, (err, result) => {
	 if (err) return console.log(err)
	 // console.log(req.body)	
	 //console.log(result.ops[0]._id)
	 res.send(result.ops[0]._id);
	//res.redirect('/adresse')

	 })

})




app.get('/chat',(req, res) => {


	io.on('connection', function(socket){
		//console.log(socket.id)
		socket.on('setUser', function(data){
	   		//console.log('setUser')
	  		//console.log(data.user)
	  		//socket.emit('ackUser', data)
	   	})
	}); // une connexion socket
	let message = "Chat socket"
	res.render('socket_vue.ejs', {message : message})


})

/*
io.on('connection', function(socket){ // l'écouteur général
     socket.on('disconnect', function(){ }); 
     socket.on('setUser', function(data){})
});
*/

app.get('/profil/:id', (req, res) => {

	 var id = req.params.id
	 const ObjectID = require('mongodb').ObjectID;
	 console.log(id)
	 db.collection('adresse')
	 .findOne({"_id": ObjectID(req.params.id)}, (err, resultat) => {
	if (err) return console.log(err)
		console.log(resultat);
	  res.render('profilMembre.ejs', {adresses: resultat})  // redirige vers la route qui affiche la collection
	 })

})


