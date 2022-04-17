const express = require('express');
const { Server } = require('socket.io');
const productRouter = require('./routes/products')
const ProductManager = require('./Manager/products')
const LogManager = require('./Manager/log')
const options = require('./options/mysqlconfig.js')
const normalizr = require('normalizr')
const normalize = normalizr.normalize
const denormalize = normalizr.denormalize
const schema = normalizr.schema

const productService = new ProductManager(options,'products')
const logService = new LogManager(options,'log')

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT,()=>{console.log(`Listening on ${PORT}`)});
const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'))

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use('/',productRouter)

const author = new schema.Entity('authors')
const mensajesS = {author:author}

const normalizeLogs = async () => {
    const mensajes = await (await logService.get()).payload
    //console.log({...mensajes})
    const normalizedData = normalize(mensajes,[mensajesS])
    const normalLength = JSON.stringify(normalizedData,null,2).length
    const normalizedLength = JSON.stringify(mensajes,null,2).length
    return {normalizedData:normalizedData, normalLength:normalLength, normalizedLength:normalizedLength}
}
normalizeLogs()

io.on('connection', async socket=>{
    console.log('new user')

    let log = await normalizeLogs()
    //let log = await (await logService.get()).payload
    let products = await productService.get()
    io.emit('productLog',products)
    if(log){
        io.emit('log',log)
    }

    socket.on('sendProduct', async data=>{
        setTimeout(async ()=>{
            let products = await productService.get()
            io.emit('productLog',products)
        },200)
    })

    socket.on('message',async data=>{
        await logService.add(data)
        .then(r=>console.log(r))
        setTimeout(async ()=>{
            //const newLog = await (await logService.get()).payload
            const newLog = await normalizeLogs()
            if(newLog){
                io.emit('log',newLog)
            }
        },200)
    })
})
