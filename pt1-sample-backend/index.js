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

    var prix = 0;
    var prixCoef = 1;

    if (heureTrajet >= 18 && heureTrajet <= 8) {
        prixCoef = 1.2;
    }

    switch (classe) {

        case '1':
            prix = (nbBagages * prixParBagage + nbPassagers * (nbKm * prixParKm * prixCoef)) * 1.5 + prixPriseEnCharge;
            return prix;

        case '2':
            prix = (nbBagages * prixParBagage + nbPassagers * (nbKm * prixParKm * prixCoef)) * 1.2 + prixPriseEnCharge;
            return prix;

        case '3':
            prix = (nbBagages * prixParBagage + nbPassagers * (nbKm * prixParKm * prixCoef)) + prixPriseEnCharge;
            return prix;

        default:
            console.log("erreur au niveau du prix")


    }
}

// calcul de distance etre le point d'arrivé et de depart

function trajetDis(depart, arrival){
  
    return getDistance(
        { latitude: 51.5103, longitude: 7.49347 },
        { latitude: "51° 31' N", longitude: "7° 28' E" }
    );

}

//get permettant de recuperer les données entré par l'utilisateur 

async function getCoordinates(depart, arrival) {
    let coordDe = await getCoordinate(depart);
    let coordAr = await getCoordinate(depart);
    return {
        arrival: {
            text: depart,
            coordinates: {
                lat: coordDe.lat,
                lon: coordDe.lon
            }
        },
        depart: {
            text: depart,
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




app.post('/getData', function (req, res) {
    depart = req.body.depart;
    arrival = req.body.arrive;
    
    //res.send(getCoordinates(depart, arrival));
    getCoordinates(depart, arrival).then(obj => {
        //console.log(obj);
        res.send(obj);
        
        
        //distance? getDistance();
        //calculate the price? calculate()
        //store to DB reservation
        

    });


   // res.json("ok");
});


//verification des disponibilitées


app.post('/getDispo', function (req, res) {
    classe = req.body.ClassSelect;
    BagagesNb = req.body.BagagesNb;

    con.query("SELECT * FROM Taxi WHERE Classe ='" + classe + "' AND Espace_bagage='" + BagagesNb + "'", (error, result) => {
        if (error) throw error;
        var resultArray = Object.values(JSON.parse(JSON.stringify(result)));
        var FinalResult = [];

    for (const element of resultArray) {

        var taxiKeyverif = "Taxi_" + element.N_taxi;
      
        if(taxiDispo[taxiKeyverif].taxiDispo){
            console.log(taxiKeyverif);
            console.log(taxiDispo[taxiKeyverif]);
            FinalResult.push(element);
        }
    }
        res.json(FinalResult);
    });
    
    
   // res.json("ok");
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


// Not app
app.get('/allPeople', function (req, res) {
    con.query('SELECT * FROM person', (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

app.get('/person/:id', function (req, res) {
    con.query('SELECT * FROM person where id=?', [req.params.id], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

app.post('/addPerson', function (req, res) {
    let postData = req.body;
    con.query('INSERT INTO person SET ?', postData, (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

app.put('/updatePerson/:id', function (req, res) {
    con.query('UPDATE person SET name=?, lastName=?, age=? where id=?', [req.body.name, req.body.lastName, req.body.age, req.params.id],
        (error, result) => {
            if (error) throw error;
            res.send(result);
        });
});

app.delete('/deletePerson/:id', function (req, res) {
    con.query('DELETE FROM person WHERE id=?', [req.params.id], (error, result) => {
        if (error) throw error;
        res.send('Number of records deleted: ' + result.affectedRows);
    });
});