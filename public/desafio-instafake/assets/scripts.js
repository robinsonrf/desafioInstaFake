//Escucha del formulario que captura los datos y los envia como parametros
$("#jwt-formulario").submit(async (e)=>{
    e.preventDefault();
    const email = document.getElementById("jwt-email").value;
    const password = document.getElementById("jwt-password").value;
        if (email !== "" && password !== ""){
    const JWT = await postData(email, password);
    getPhotos(JWT);
    }else{
        alert("Debe completar su usuario y contraseña")
    }
});

//Función para buscar el usaurio en la base de datos, devuelve el token encontrado si el usuario está en la BD
const postData = async (emailIng, passwordIng) =>{
    try{
        const response = await fetch("http://localhost:3000/api/login",
        {
            method: 'POST',
            body: JSON.stringify({email: emailIng, password: passwordIng})
        });
        const {token} = await response.json();
        if(!token){
            alert("Usuario no existe, intente nuevamente");
            location.reload()
        }else{
            localStorage.setItem('jwt-token', token);
            return token;
        }
    }catch(err){
        console.error(`Error: ${err}`);
    }
};


//funcion que obtiene las fotos si el usuario esta autorizado
const getPhotos = async (jwt) => {
    try {
        const response = await fetch("http://localhost:3000/api/photos",
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const {data} = await response.json();
        //si esta disponible la data llama a las funciones para mostrar los posts
            if (data){
                llenadoDiv(data);
                toggleFormDiv();
            }
    } catch (err) {
        localStorage.clear()
        console.error(`Error: ${err}`);
    };
};

//Funcion que muestra las imagenes
const llenadoDiv = (datos) =>{
    let imgDiv = "";
    $.each(datos, (i, elemento) => {
        imgDiv += 
        `<div class="card d-block my-5 px-0 mx-0" style="border:1px solid lightblue">
            <img class="card-img-top" src="${elemento.download_url}" alt=" " style="margin-inline: auto;">
            <div>
                <p class="card-text p-3">Autor: ${elemento.author}</p>
            </div>
        </div>`
        });
        $(`#contenido`).html(imgDiv);
};

//funcuion que muestra o esconde los post y el formulario
const toggleFormDiv = () => {
    $(`#jwt-div-formulario`).toggle()
    $(`#js-contenido`).toggle()
    
}





//Funcion que verifica si existe un token en el LocalStorage y muestra el contenido en caso de existir.
const init = (async () => {
    const token = localStorage.getItem('jwt-token')
    if(token) {
        getPhotos(token);
    }
})();

//Boton de logout
document.getElementById('logout').addEventListener('click',() => {
    localStorage.clear()
    location.reload()
})

//MOSTRAR MAS FOTOS
let pagina = 2
//escucha de boton que al hacer click muestra mas posts 
document.getElementById('mostrarbtn').addEventListener('click',async()=>{
    const token = localStorage.getItem('jwt-token')
    if(pagina<=10){
        try{
            const response = await fetch(`http://localhost:3000/api/photos?page=${pagina}`,
                {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const {data} = await response.json()
            if(data){
                let imgDiv = "";
                $.each(data,(i,elemento)=>{
                    imgDiv += `<div class="card d-block my-5 px-0 mx-0" style="border:1px solid lightblue">
                                    <img class="card-img-top" src="${elemento.download_url}" alt=" " style="margin-inline: auto;">
                                    <div>
                                       <p class="card-text p-3">Autor: ${elemento.author}</p>
                                    </div>
                                </div>`
                });
                $(`#contenido`).append(imgDiv);
            }
        }catch(err){
            localStorage.clear();
            console.error(`Error: ${err}`);
        } 
        pagina++
        if(pagina == 11) {
        document.getElementById('mostrarMas').innerHTML = "No hay mas elementos para mostrar"
        }
    };
});