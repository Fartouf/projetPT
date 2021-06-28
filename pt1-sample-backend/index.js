module.exports = {
    verifPrix : function(nmKM, classe, nbBagages, nbPassagers, heureTrajet){
        return price(nmKM, classe, nbBagages, nbPassagers, heureTrajet);
    },

    getDist : function(longitudeDepart, latitudeDepart, longitudeArrive, latitudeArrive){
        return getDist(longitudeDepart, latitudeDepart, longitudeArrive, latitudeArrive);
    }
}

require('dotenv').config()
const express = require('express');

// geolib 
const geolib = require('geolib');

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//socket.io
io.on('connection', socket => {
    console.log('New client connected')
    socket.on('new-message', (message) => { //event
        console.log(message);
        io.emit('new-message', message);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

server.listen(3000, function () {
    console.log('Example app listening on port 3000! ')
});


const mysql = require('mysql');
const { post } = require('request');

if (!process.env.DB_USER || !process.env.DB_PASS) {
    console.log("User/pass don't set in the .env file");
    process.exit(1);
}

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

app.get('/', function (req, res) {
    //reply file
    res.sendFile(__dirname + '/index.html');
});

// project TAXI //

//Simulation de la position des taxis et disponibilité

var taxiPosition = {};
var taxiDispo = {};

function initTaxi() {
    var taxis;
    con.query('SELECT * FROM Taxi', (error, result) => {
        if (error) throw error;

        taxis = JSON.parse(JSON.stringify(result));

        for (const element of taxis) {

            var taxiNb = element.N_taxi;

            var taxiKey = "Taxi_" + taxiNb;
            console.log(taxiKey);

            taxiPosition[taxiKey] = {
                lon : 6.1408549908111665,
                lat : 46.194384746564715
            };
            taxiDispo[taxiKey] = {
                taxiDispo : true
            };
            
          }
          console.log(taxiPosition);
          console.log(taxiDispo);
    });
}

initTaxi();



//Calcul de prix

var prixPriseEnCharge = 3;
var prixParBagage = 2;
var prixParKm = 2;

function price(nmKM, classe, nbBagages, nbPassagers, heureTrajet) {
    console.log(nmKM);
    var prix = 0;
    var prixCoef = 1;

    if ((heureTrajet >= 18 && heureTrajet <= 24) ||(heureTrajet >= 0 && heureTrajet <= 8)) {
        prixCoef = 1.2;
    }

    switch (classe) {

        case 1:
            prix = (nbBagages * prixParBagage + nbPassagers * (nmKM * prixParKm * prixCoef)) * 1.5 + prixPriseEnCharge;
            return prix.toPrecision(2);

        case 2:
            prix = (nbBagages * prixParBagage + nbPassagers * (nmKM * prixParKm * prixCoef)) * 1.2 + prixPriseEnCharge;
            return prix.toPrecision(2);

        case 3:
            prix = (nbBagages * prixParBagage + nbPassagers * (nmKM * prixParKm * prixCoef)) + prixPriseEnCharge;
            return prix.toPrecision(2);

        default:
            console.log("erreur au niveau du prix")


    }
}

//API de calcul d'itineraire pour le trajet

async function itineraire(longitudeDepart, latitudeDepart,longitudeArrive,latitudeArrive) {

    return new Promise(resolve => {
        http.get('http://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248197905c175e845e4aa28a0db9be5953c&start=' +longitudeDepart+ ',' + latitudeDepart + '&end=' + longitudeArrive + ',' +latitudeArrive , res => {

            let data = [];

            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                const trajet = JSON.parse(Buffer.concat(data).toString());
                var info = trajet.features[0].properties.summary;
                resolve(info);
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    });
}

//get permettant de recuperer les données entré par l'utilisateur 

async function getCoordinates(depart, arrival) {
    let coordDe = await getCoordinate(depart);
    let coordAr = await getCoordinate(arrival);
    return {
        depart: {
            text: depart,
            coordinates: {
                lat: coordDe.lat,
                lon: coordDe.lon

            }

        },
        arrival: {
            text: arrival,
            coordinates: {
                lat: coordAr.lat,
                lon: coordAr.lon
            }
        }
    };

}


async function getCoordinate(address) {

    return new Promise(resolve => {
        http.get('http://api.positionstack.com/v1/forward?access_key=f67b3109ab6c60c25caf85b2ffbd1d3c&query=' + address, res => {

            let data = [];
            let coord = {};

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {

                const users = JSON.parse(Buffer.concat(data).toString());
                coord.lat = users.data[0].latitude;
                coord.lon = users.data[0].longitude;
                resolve(coord);
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    });
}

// calcul de distance etre le point d'arrivé et de depart

function getDist(longitudeDepart, latitudeDepart, longitudeArrive, latitudeArrive) {
    return geolib.getDistance(
        { latitude: latitudeDepart, longitude: longitudeDepart },
        { latitude: latitudeArrive, longitude: longitudeArrive }
    );

}



app.post('/getData', function (req, res) {
    var IDReservation;
    depart = req.body.depart;
    arrival = req.body.arrive;
    classe = parseInt(req.body.ClassSelect);
    BagagesNb = parseInt(req.body.BagagesNb);
    personnesNb = parseInt(req.body.personnesNb);
    

    //res.send(getCoordinates(depart, arrival));
    getCoordinates(depart, arrival).then(obj => {
        dataCoordsTrajet = obj;
        console.log(dataCoordsTrajet);

        longitudeDepart = obj.depart.coordinates.lon;
        latitudeDepart = obj.depart.coordinates.lat;

        longitudeArrive = obj.arrival.coordinates.lon;
        latitudeArrive = obj.arrival.coordinates.lat;

        itineraire(longitudeDepart, latitudeDepart, longitudeArrive, latitudeArrive).then(obj => {
            var FinalResult = [];
            var itineraire;

            itineraire = obj;

            con.query("SELECT * FROM Taxi WHERE Classe ='" + classe + "' AND Espace_bagage>='" + BagagesNb + "' AND Nombre_de_place >= '" + personnesNb + "'", (error, result) => {

                var taxiKeyverif;

                if (error) throw error;
                var resultArray = Object.values(JSON.parse(JSON.stringify(result)));

                for (const element of resultArray) {

                    taxiKeyverif = "Taxi_" + element.N_taxi;

                    if (taxiDispo[taxiKeyverif].taxiDispo) {
                        FinalResult.push(element);
                    }
                }

                console.log(FinalResult);

                if(FinalResult.length === 0){
                    InfoCli = [{
                        Idr : "pas de taxi disponible",
                        Idc : "pas de taxi disponible"
                    }]
                    res.json(InfoCli);
                   
                }else{
                    var minDist = 1000;
                    var taxiSelectId;
                    for (const element of FinalResult) {
                        var temp = [];
                        taxiKeyverif = "Taxi_" + element.N_taxi;
    
                        if (minDist > getDist(longitudeDepart, latitudeDepart, taxiPosition[taxiKeyverif].lon, taxiPosition[taxiKeyverif].lat) / 1000) {
                            
                            taxiSelectId = element.N_taxi;
                            minDist = getDist(longitudeDepart, latitudeDepart, taxiPosition[taxiKeyverif].lon, taxiPosition[taxiKeyverif].lat) / 1000;
                        }
    
                    }
                    console.log(taxiSelectId);
    
                    var IdClient = Math.floor(Math.random() * 1000) + 1;
                    IDReservation = Math.floor(Math.random() * 1000) + 1;
                    distanceTraj = obj.distance/1000;
                    var d = new Date();
                    var n = d.getHours();
    
                    prixTrajet = price(distanceTraj,classe,BagagesNb,personnesNb,n);
                    
                    let postDataCli = {};
                    
                    postDataCli.N_idclient = IdClient;
                    postDataCli.nom = req.body.nom;
                    postDataCli.prenom = req.body.prenom;
                    postDataCli.age = parseInt(req.body.age);

                    con.query('INSERT INTO Client SET ?', postDataCli, (error, result) => {
                        if (error) throw error;
                    });

                    let postData = {};
    
                    postData.N_taxi = taxiSelectId;
                    postData.N_idclient = IdClient;
                    postData.N_reservation = IDReservation;
                    postData.Nb_pers_transport = personnesNb;
                    postData.Nb_de_bagages = BagagesNb;
                    postData.Depart = depart;
                    postData.Arrive = arrival;
                    postData.Prix = prixTrajet;
                    postData.Distance = distanceTraj;
    
                    
                    console.log(postData);
    
                    con.query('INSERT INTO Réservation_course SET ?', postData, (error, result) => {
                        if (error) throw error;
                        taxiDispo["Taxi_" + taxiSelectId].taxiDispo = false;
                        taxiPosition["Taxi_" + taxiSelectId].lon = longitudeArrive;
                        taxiPosition["Taxi_" + taxiSelectId].lat = latitudeArrive;
                        console.log(taxiPosition);
                    });

                    InfoCli = [{
                        Idr : IDReservation,
                        Idc : IdClient
                    }]
                    res.json(InfoCli);
                }
            });

        });
    });
});


//verification des disponibilitées

app.post('/getDispo', function (req, res) {
    classe = req.body.ClassSelect;
    BagagesNb = req.body.BagagesNb;
    personnesNb = req.body.personnesNb;

    con.query("SELECT * FROM Taxi WHERE Classe ='" + classe + "' AND Espace_bagage>='" + BagagesNb + "' AND Nombre_de_place >= '" + personnesNb + "'", (error, result) => {
        if (error) throw error;
        var resultArray = Object.values(JSON.parse(JSON.stringify(result)));
        var FinalResult = [];

    for (const element of resultArray) {

        var taxiKeyverif = "Taxi_" + element.N_taxi;
      
        if(taxiDispo[taxiKeyverif].taxiDispo){
            FinalResult.push(element);
        }
    }
    if(FinalResult.length === 0){
        reponse = [{
            Marque : "Pas de taxi disponible selon vos selections"
        }]
        res.json(reponse);
    }else {
        res.json(FinalResult);
    }
    });
});

//confimer une reservation 

app.post('/confirmReservation', function (req, res) {

    console.log(req.body);
    IDClient = req.body.IDClient;
    IDReservation = req.body.IDReservation;

    console.log(IDClient);

    con.query("SELECT * FROM Réservation_course WHERE N_idclient ='" + IDClient + "' AND N_reservation ='" + IDReservation + "'", (error, result) => {
        if (error) throw error;
        var resultArray = Object.values(JSON.parse(JSON.stringify(result)));
        var reponse = [];
        console.log(resultArray);

        if(resultArray.length === 0){
            reponse = [{
                reponse : "cette reservation n'existe pas, veillez verifier vos informations"
            }]
            res.json(reponse);
        }else {

            Idtaxi = "Taxi_" + resultArray[0].N_taxi;

            taxiDispo[Idtaxi].taxiDispo = true;

            let postData = {};

            courseID = IDReservation;
    
    
            postData.N_course = courseID;
            postData.N_Client = IDClient;
    
            con.query('INSERT INTO Course SET ?', postData, (error, result) => {
                if (error) throw error;
            });
            
            reponse = [{
                reponse : "Votre reservation a été comfimé"
            }]
            
            res.json(reponse);
        }

    });
});

// project TAXI 

app.get('/allTaxis', function (req, res) {
    con.query('SELECT * FROM Taxi', (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

//

app.post('/addReservation', function (req, res) {
    let postData = req.body;
    con.query('INSERT INTO person SET ?', postData, (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

