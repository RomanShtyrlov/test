const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
	host: '127.0.0.1', // localhost
  	dialect: 'sqlite',
  	pool: {
    	max: 5,
    	min: 0,
    	idle: 10000
  	},
  	storage: 'data/db.sqlite'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

     Top = sequelize.define('top', {
      username: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.FLOAT
      }
    });
    // dbSetup();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

function dbSetup() {
    Top.sync({force: true}) 
    .then(function(){
        Top.create({ username: "Bot", score: 0}); 
	});  
}

function dbAdd(username, score) {
    Top.create({ username: username, score: score }).then(top => {
        console.log("Auto-generated ID:", top.id);
    });
}

function dbRemove(username) {
    Top.destroy({
        where: {
          username: username
        }
      }).then(() => {
        console.log("Done");
      });         
}

function dbGetTop(num) {
    return Top.findAll({
        limit: num,
		order: [
            ['score', 'DESC']
        ]
	}).then(tops => tops);
}

function dbGetUser(name) {
    return Top.findAll({
        where: {
          username: name
        }
      }).then(user => user);
}

function dbGetAll() {
    Top.findAll().then(tops => {
        tops.forEach(top => {
			console.log(top.username, top.score);
		});
    });
}

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});


app.get('/top', function(req, res) {
    //request.params.n
    dbGetTop(3).then(tops => {
        res.send({"top": JSON.stringify(tops)});
    });
});

app.post('/getUser', function(req, res) {
    dbGetUser(req.body.name.toString()).then(user => {
        res.send({"user": JSON.stringify(user)});
    });
});

app.post('/save', (req, res) => {
    try  {
        let username = req.body.name.toString();
        let score = parseInt(req.body.score);

        dbAdd(username, score);
        res.send({"status":"successefully saved"});
    }
    catch (e) {
        console.log("Some error occured:" + e);
        res.send("Wrong data was sent");
    } 
    
});

app.post('/remove', (req, res) => {
    try  {
        let username = req.body.name.toString();
        let score = parseInt(req.body.score);

        dbRemove(username);
        res.send({"status":"removed"});
    }
    catch (e) {
        console.log("Some error occured:" + e);
        res.send("Wrong data was sent");
    } 
    
});

app.post('/add', (request, response) => {
    fs.readFile('./data/top.json', 'utf8', (err, data) => {
        if (err){
            console.log(err);
        } else {
            let obj = JSON.parse(data); 
            obj.top.push({name: request.body.name, score: request.body.score}); 
            
            obj.top.sort((a,b) => {
                if (a.score > b.score) {
                    return 1;
                }
                else if (a.score < b.score) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            let len = obj.top.length;
            let slicedTop = obj.top.reverse();
            if (len > 3) {
              slicedTop =  obj.top.slice(0, 3);
            }
            obj.top = slicedTop;
            console.log(obj);
            let str = JSON.stringify(obj); 
            fs.writeFile('./data/top.json', str, 'utf8', (err) => {
                if (err) {
                    console.log("err");
                }
                else {
                    response.send({"status":"Sucesfully added"});
                }
            }); 
        }
    });    
});