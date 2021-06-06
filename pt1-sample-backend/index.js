require('dotenv').config()
const express = require('express');
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



//Api de geolocalisation


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
        http.get('http://api.positionstack.com/v1/forward?access_key=a4bbcf52bef8635021daef9f0ab571da&query=' + address, res => {

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





// project TAXI 

app.get('/allTaxis', function (req, res) {
    con.query('SELECT * FROM Taxi', (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


var grid = new Array(10);


/*
function initTaxi() {
    var taxis;
    con.query('SELECT * FROM Taxi', (error, result) => {
        if (error) throw error;

        taxis = JSON.parse(JSON.stringify(result));

        var k = 0;
        for (var i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                grid[i] = taxis[k].N_taxi;
                console.log(grid[i]);
                k++;
            } else {
                grid[i] = 0;
            }
        }
    });
}

initTaxi();
*/

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