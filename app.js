// const http = require('http')
// const url = require('url')
// const fs = require('fs')

// function onRequest(req,res) {
//     res.writeHead(200,{'Content-Type':'text/html'})

//     let link = url.parse(req.url,true)

//     if(link.pathname === '/'){
//         fs.readFile('./index.html',(err,data) => {
//             if(err){
//                 res.end('Error occured')
//             }
//             res.write(data)
//             res.end()
//         })
//     } else if(link.pathname === '/add' && req.method === 'GET'){
//         res.end('this is get request')
//     } else if(link.pathname === '/add' && req.method === 'POST'){
//         res.end('This is post request')
//     }
// }

// let server = http.createServer(onRequest)
// server.listen(4000, () => console.log('Server is running'))
const express = require('express')
const app = express()
const fs = require('fs')
const filename = './db.json'

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res) => {
    res.sendFile(__dirname+'/index.html')
})

app.post('/add',(req,res) => {
    
    let user = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    
    db.users.push(user)

    fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err) => {
        if(err) console.log(err)
        res.send('User added!')
    })
})

app.get('/view',(req,res) => {

    res.writeHead(200,{'Content-Type':'text/html'})

    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)

    res.write('<table><tr><th>Name</th><th>Email</th><th>Roll number</th></tr>')
    db.users.forEach((user) => {
        res.write(`<tr><td>${user.name}</td><td>${user.email}</td><td>${user.rno}</td></tr>`)
    })
    res.write('</table>')
    res.end()
})

app.post('/update',(req,res) => {

    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)
    let rno = req.body.rno

    db.users.forEach(user => {
        if(user.rno === rno) {
            user.email = req.body.email
        }
    })

    fs.writeFile(filename,JSON.stringify(db,null,'\t'),(err) => {
        if(err) console.log(err)
        res.send('Email updated!')
    })
})

app.listen(4000,() => console.log('Server running'))