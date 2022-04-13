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

const handleChatForm = (e)=>{
    e.preventDefault()
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth()+1
        let d = date.getDate()
        let h = date.getHours()
        let min = date.getMinutes()
        if(chatBox.value.trim().length > 0 && email.value.trim().length > 0){
            socket.emit('message',{
                email:email.value,
                date:`${y}/${m}/${d} ${h}:${min}`,
                message:chatBox.value
            })
            chatBox.value = ''
            email.value = ''
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
    let messages = ''
    
    data.forEach(message => {
        messages = messages+`<span class="email">${message.email}</span> <span class="date">${message.date}</span> dice <span class="message">${message.message}</span> <br>`
    });
    log.innerHTML = messages
})