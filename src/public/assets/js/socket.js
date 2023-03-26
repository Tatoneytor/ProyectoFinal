let productMessage = document.querySelector('#mensajeDeActualizacion');
let divActualizador = document.getElementById('actualizador')
let socket = io();


socket.on('editProduct', async (products) => {
    console.log('Entro al Socket.js!!!')
    console.log('Esto andaaaa!!!', products, products[0].title);

    divActualizador.innerHTML = ''
    for (const product of products) {
        divActualizador.innerHTML += `
    <li>
    <b> ${product.title}</b>
    <br>
    Precio: ${product.price}
    <br>
    Descripción: ${product.description}
    <br>
    </li>`
    }
    productMessage.innerHTML = `<p> Se ha editado la lista de productos </p>`
})



// SOCKET para el chat
Swal.fire({
    title: "Identifiquese",
    input: "text",
    text: "Ingrese su nickname",
    inputValidator: (value) => {
        return !value && "Debe ingresar un nombre"
    },
    allowOutsideClick: false
}).then(resultado => {
    nombre = resultado.value

    let divMensajes = document.querySelector('#mensajes')
    let textMensaje = document.querySelector('#mensaje')

    textMensaje.focus()

    textMensaje.addEventListener('keyup', (evento) => {
        if (evento.keyCode == 13) {
            if (evento.target.value.trim() != '') {
                socket.emit('mensaje', {
                    emisor: nombre,
                    mensaje: evento.target.value
                })
                textMensaje.value = ''
                textMensaje.focus()
            }
        }
    })

    socket = io()

    socket.on('hola', (objeto) => {
        console.log(`${objeto.emisor} dice ${objeto.mensaje}`)

        objeto.mensajes.forEach(el => {
            divMensajes.innerHTML += `<br><div class='mensaje'><strong>>${el.emisor}</strong> dice <i>${el.mensaje}</i></div>`
        });
        divMensajes.scrollTop = divMensajes.scrollHeight;

        socket.emit('respuestaAlSaludo', {
            emisor: nombre,
            mensaje: `Hola, desde el Frontend`
        })
    })

    socket.on('nuevoUsuario', (usuario) => {
        Swal.fire({
            text: `${usuario} se ha conectado...!!!`,
            toast: true,
            position: "top-right"
        })
    })

    socket.on('nuevoMensaje', (mensaje) => {
        divMensajes.innerHTML += `<br><div class='mensaje'><strong>${mensaje.emisor}</strong> dice <i>${mensaje.mensaje}</i></div>`

        divMensajes.scrollTop = divMensajes.scrollHeight;
    })


    socket.on('nuevoHeroe', (objeto) => {
        divMensajes.innerHTML += `<br>Se ha creado el heroe<strong> ${objeto.heroe.nombre}</strong>`
    })

})