
const socket = io()

// Formulario de ingreso de productos
let form = document.getElementById('productForm')
const handleSubmit = (e,form,route)=>{
    e.preventDefault()
    let formData = new FormData(form)
    fetch(route,{
        method:'POST',
        body:formData
    }).then(r=>r.json()).then(json=>console.log(json))
    .then(socket.emit('sendProduct'))
    
    form.reset()
}

form.addEventListener('submit',(e)=>handleSubmit(e,e.target,'/'))

// chat
let email = document.getElementById('email')
let chatBox= document.getElementById('chatBox')
let chatForm = document.getElementById('chatForm')
let name = document.getElementById('name')
let lastName = document.getElementById('lastName')
let age = document.getElementById('age')
let avatar = document.getElementById('avatar')
let userName = document.getElementById('userName')

const handleChatForm = (e)=>{
    e.preventDefault()
        // let date = new Date()
        // let y = date.getFullYear()
        // let m = date.getMonth()+1
        // let d = date.getDate()
        // let h = date.getHours()
        // let min = date.getMinutes()
        if(chatBox.value.trim().length > 0 && email.value.trim().length > 0){
            socket.emit('message',{
                author: {
                    id: email.value,
                    nombre: name.value,
                    apellido: lastName.value,
                    edad: parseInt(age.value),
                    alias: userName.value,
                    avatar: avatar.value
                },
                text:chatBox.value
            })
            chatBox.value = ''
            email.value = ''
            name.value = ''
            lastName.value = ''
            userName.value = ''
            avatar.value = ''
            age.value = null
        }
        else {console.log('fallo')}
        
}
chatForm.addEventListener('submit',(e)=>{
    handleChatForm(e)
    if(e.key === 'Enter'){
        handleChatForm(e)
    }
})

socket.on('productLog',data=>{
    console.log(data)

    let products = data.payload
    let productsTemplate = document.getElementById('productsTemplate')
    fetch('templates/products.ejs').then(r=>{
        return r.text()
    }).then(template =>{
        const html = ejs.render(template,{products:products})
        productsTemplate.innerHTML = html
    })

})

socket.on('log',data=>{
    let log = document.getElementById('log')
    let ratio = document.getElementById('ratio')
    let messages = ''
    
    const author = new normalizr.schema.Entity('authors')
    const mensajesS = {author:author}

    const denormalizedData = normalizr.denormalize(data.normalizedData.result,[mensajesS],data.normalizedData.entities)

    denormalizedData.forEach(message => {
        messages = messages+`<span class="email">${message.author.id}</span> <span class="date">${message.author.alias}</span> dice <span class="message">${message.text}</span> <br>`
    });

    ratio.innerHTML = `Porcentaje de compresion de datos: ${Math.floor((1-(data.normalLength/data.normalizedLength))*100)}%`
    log.innerHTML = messages
})