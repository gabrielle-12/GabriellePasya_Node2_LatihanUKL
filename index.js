const express = require('express')
var session = require('express-session')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000;
const secretKey = 'thisisverysecretkey'

const db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: "sewa"
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//TOKEN
const isAuthorized = (request, result, next) => {
    if (typeof(request.headers['x-api-key']) == 'undefined') {
        return result.status(403).json({
            success: false,
            message: 'Unauthorized. Token is not provided'
        })
    }

    let token = request.headers['x-api-key']

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return result.status(401).json({
                success: false,
                message: 'Unauthorized. Token is invalid'
            })
        }
    })

    next()
}

//LOGIN UNTUK ADMIN
//mencocokkan username dan password yang ada di database
app.post('/login', function(request, response) {
    let data = request.body
	var username = data.username;
	var password = data.password;
	if (username && password) {
		db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = data.username;
				response.redirect('/home');
			} else {
				response.send('Username dan/atau Password salah!');
			}			
			response.end();
		});
	} else {
		response.send('Masukkan Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, result ) {
	if (request.session.loggedin) {
        let data = request.body
        let token = jwt.sign(data.username + '|' + data.password, secretKey)

        result.json({
            success: true,
            message: 'Selamat Datang, ' + request.session.username + '!',
            token: token
        })

    } else {
		result.json({
            success: false,
            message: 'Mohon Login Terlebih Dahulu !'
        })
	}
	result.end();
});

//CRUD ADMIN 
app.get('/admin', (req, res) => {
    let sql= ` 
        select username, created_at from admin`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "success get all user",
            data: result
        })
    })
})

app.post('/admin', (req, res) => {
    let data = req.body 

    let sql= ` 
        insert into admin (username, password) values ('`+data.username+`', '`+data.password+`')`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "admin created",
            data: result
        })
    })
})

app.put('/admin/:id',(req, res) => {
    let data = req.body

    let sql = `
        update admin
        set username = '`+data.username+`', password = '`+data.password+`'
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data  has been updated",
            data: result
        })
    })
})

app.delete('/admin/:id', (req, res) => {
    let sql = `
        delete from admin
        where id = `+req.params.id+`
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data has been deleted",
            data: result
        })
    })
})

//CRUD MOBIL
app.get('/mobil', (req, res) => {
    let sql= ` 
        select nama_mobil, tipe_mobil, stock created_at from mobil`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "sukses menampilkan semua mobil",
            data: result
        })
    })
})

app.post('/mobil', isAuthorized, (req, res) => {
    let data = req.body 

    let sql= ` 
        insert into mobil (nama_mobil, tipe_mobil, stock) values ('`+data.nama_mobil+`', '`+data.tipe_mobil+`','`+data.stock+`')`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "mobil berhasil ditambahkan",
            data: result
        })
    })
})

app.put('/mobil/:id',isAuthorized, (req, res) => {
    let data = req.body

    let sql = `
        update mobil
        set nama_mobil = '`+data.nama_mobil+`', tipe_mobil = '`+data.tipe_mobil+`', stock = '`+data.stock+`'
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data mobil berhasil diubah",
            data: result
        })
    })
})

app.delete('/mobil/:id', (req, res) => {
    let sql = `
        delete from mobil
        where id = `+req.params.id+`
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data mobil berhasil dihapus",
            data: result
        })
    })
})

//CRUD MOTOR
app.get('/motor', (req, res) => {
    let sql= ` 
        select nama_motor, tipe_motor, stock created_at from mobil`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "sukses menampilkan semua motor",
            data: result
        })
    })
})

app.post('/motor', isAuthorized, (req, res) => {
    let data = req.body 

    let sql= ` 
        insert into motor (nama_motor, tipe_motor, stock) values ('`+data.nama_motor+`', '`+data.tipe_motor+`','`+data.stock+`')`
    
    db.query(sql, (err, result) => {
        if (err) throw err
    
        res.json({
            message: "motor berhasil ditambahkan",
            data: result
        })
    })
})

app.put('/motor/:id',isAuthorized, (req, res) => {
    let data = req.body

    let sql = `
        update motor
        set nama_motor = '`+data.nama_motor+`', tipe_motor= '`+data.tipe_motor+`', stock = '`+data.stock+`'
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data motor berhasil diubah",
            data: result
        })
    })
})

app.delete('/motor/:id', (req, res) => {
    let sql = `
        delete from motor
        where id = `+req.params.id+`
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data motor berhasil dihapus",
            data: result
        })
    })
})


app.listen(port, () =>{
    console.log('App running on port ' +port)
})