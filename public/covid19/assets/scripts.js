// Hito 1 - Consumir API
const getTotal = (() => {
    const url = 'http://localhost:3000/api/total';
    try {
        const covid = async () => {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        //trae promesa pendiente.!
        //console.log(covid());
        return covid;
    } catch (err) {
        console.log(`Error en datos: ${err}`);
    }
})();

// (()=>{
    // getTotal();

// })();

//Hito 1 - OBTENER DATOS PAISES
const getCountry = ((country) => {
    const url = `http://localhost:3000/api/countries/${country}`; // para obtener esta información debes llamar a la API http://localhost:3000/api/countries/{country} 
    try {
        const covidCountry = async () => {
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data)
            return data;
        }
        //console.log(covidCountry())
        return covidCountry();
    } catch (err) {
        console.log(err);
    }
});


//**HITO 2 - LOGIN y DATOS CASOS CHILE**********
const apiLogin = async (email2, password2) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email2,
                password: password2
            })
        });
        const { token } = await response.json(); 
        localStorage.setItem('my-token', token);
        return token;
    } catch (error) {
        console.log(error);
    }

}

const getConfirmados = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/confirmed', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        const { data } = await response.json()

        return data

    } catch (error) {

    }
}

const getMuertos = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/deaths', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        const { data } = await response.json()

        return data

    } catch (error) {

    }
}

const getRecuperados = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/recovered', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        const { data } = await response.json()

        return data

    } catch (error) {

    }
}
//*******************************************/

const casosCovid =  async () => {
    const token = localStorage.getItem('my-token');
        if(token){
            $("#chile").css("display", "block");
            $("#cerrar").css("display", "block");
            $("#inicio").css("display", "none");
            }
    const covid = await getTotal();
    //console.log(covid.data);
    covid.data.filter((element) => element.confirmed >= 100000).forEach((element) =>{
        let activos = {label: element.location, y: element.active};

        let confirmados = {label: element.location, y:element.confirmed};

        let muertos = {label: element.location, y: element.deaths};

        let recuperados= {label: element.location, y: element.recovered};
        casosActivos.push(activos);
        casosConfirmados.push(confirmados);
        casosMuertos.push(muertos);
        casosRecuperados.push(recuperados);  
    });
    
    CanvasJS.addColorSet("greenShades",
    [//colorSet Array

    "#F94892",
    "#FFCC1D",
    "#AAA492",
    "#7FC8A9"                
    ]);

    var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    colorSet: "greenShades",
    title: {
        text: "Paises con Covid19"
    },
    toolTip: {
        shared: true
    },
    legend: {
        cursor: "pointer",
        verticalAlign: "top",
        itemclick: toggleDataSeries
    },
    data: [{
        type: "column",
        name: "activos",
        legendText: "Casos Activos",
        showInLegend: true,
        dataPoints: casosActivos
    },
        {
        type: "column",
        name: "confirmados",
        legendText: "Casos Confirmados",
        showInLegend: true,
        dataPoints: casosConfirmados
    },
    {
        type: "column",
        name: "muertos",
        legendText: "Casos Muertos",
        showInLegend: true,
        dataPoints: casosMuertos
    },
    {
        type: "column",
        name: "recuperados",
        legendText: "Casos Recuperados",
        showInLegend: true,
        dataPoints: casosRecuperados
    },
    ]
});
chart.render();

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    }
    else {
        e.dataSeries.visible = true;
    }
    chart.render();
}

let modalGrafico = (async (pais) => {
    const covidPais = await getCountry(pais);
    var chart2 = new CanvasJS.Chart("chartContainer2", {
        theme: "light1", 
        animationEnabled: true, 		
        title: {
            text: `Casos Covid en ${covidPais.data.location}`,
        },
        data: [
            {
                type: "pie",
                startAngle: 240,
                indexLabel: "{label} {y}",
                dataPoints: [
                    { label: "Activos", y: covidPais.data.active },
                    { label: "Confirmados", y: covidPais.data.confirmed },
                    { label: "Muertos", y: covidPais.data.deaths },
                    { label: "Recuperados", y: covidPais.data.recovered }
                ]
            }
        ]
    });
    chart2.render();
    //$("#exampleModal").modal("toggle");
});
covid.data.forEach((element, indice) => {
    document.getElementById("tabla").innerHTML +=`
        <tr >
            <td>${element.location}</td>
            <td>${element.active}</td>
            <td>${element.confirmed}</td>
            <td>${element.deaths}</td>
            <td>${element.recovered}</td>
            <td><a id="modal-${indice}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="text-decoration-none" href="#exampleModal">Ver detalle</a></td>
        </tr>
        `
});

covid.data.forEach((element, indice)=>{
    $(`#modal-${indice}`).on("click", function () {
        let pais = element.location;
        modalGrafico(pais);
    });

});

}
//FINAL FUNCION PRINCIPAL HITO 1


//Variables
var casosActivos = [];
var casosConfirmados = [];
var casosMuertos = [];
var casosRecuperados = [];


// INICIO
const formulario = document.getElementById("formulario");
const inicio = document.getElementById("inicio");
const chile = document.getElementById("chile");
const home = document.getElementById("home");
const cerrar = document.getElementById("cerrar");
    
casosCovid();


//********************************************************/
//main
//Capturar evento click al Inicio de de Sesion



home.addEventListener('click', ()=>{
    $("#covid-19").css("display","none");
    $("#covidTotal").css("display","block");
    $("#tablaTotal").css("display","block");

})

inicio.addEventListener('click', () => {
        $('#modalLogin').modal('toggle') // hace visible el modal con el login
});

cerrar.addEventListener("click", () =>{
    localStorage.clear(); // elimina el JWT almacenado.
    location.reload(true); // Recarga pagina
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()
    let email = formulario.email.value;
    let password = formulario.password.value;

        token = await apiLogin(email, password);

    if (token) {   // si existe el JWT se ejecuta todo lo que esta dentro del if
        $('#modalLogin').modal('toggle'); // Oculta el modal
        $("#inicio").css("display", "none");
        $("#cerrar").css("display", "block");
        chile.style.display = "block"; // hace visible el link a Situación Chile..

    } else if(email == "" || password == "" || !token){
        alert("usuario o contraseña invalido")
        localStorage.clear()
        //location.reload(); //Reacargar Pagina
    }

});


chile.addEventListener('click', async () => {
    const persistir = localStorage.getItem('my-token');

    let covidConfirmadosArray = [];
    let covidMuertosArray = [];
    let covidRecuperadosArray = [];
    $("#covid-19").css("display", "block");
    $("#covidTotal").css("display", "none");
    $("#tablaTotal").css("display", "none");
    console.log("entramos en Situacion Chile esperar la carga de los datos de chile demora algunos segundos");
    document.getElementById("covid-19").innerHTML =`<div class="text-center mt-5"><img src="./assets/img/loading.gif"></div>`

    const covidConfirmados = await getConfirmados(persistir);
    const covidMuertos = await getMuertos(persistir);
    const covidRecuperados = await getRecuperados(persistir);

    covidConfirmados.forEach((a) => {
        let confirmados = {label: a.date, y: a.total};
        covidConfirmadosArray.push(confirmados);
    });

    covidMuertos.forEach((a) => { 
        let muertos = {label: a.date, y: a.total};
        covidMuertosArray.push(muertos);
    });

    covidRecuperados.forEach((a) => {
        let recuperados = {label: a.date, y: a.total};
        covidRecuperadosArray.push(recuperados);
    });

    CanvasJS.addColorSet("covid-19", ["#FFCC1D","#AAA492","#7FC8A9"]);
    var chart = new CanvasJS.Chart("covid-19", {
        animationEnabled: true,
        colorSet: "covid-19" ,
        title: {
            text: "Situacion Chile"
        },
        axisY: {
            title: "Casos"
        },
        axisX: {
            title: "Fechas"
        },
        toolTip: {
            shared: true
        },
        legend:{
            verticalAlign: "top",
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "infectados",
            dataPoints: covidConfirmadosArray
        },
        {
            type: "line",
            name: "Muertos",
            showInLegend: true,
            dataPoints: covidMuertosArray
        },
        {
            type: "line",
            name: "Recuperados",
            showInLegend: true,
            dataPoints: covidRecuperadosArray
        }
        ]
    });
    chart.render();
});