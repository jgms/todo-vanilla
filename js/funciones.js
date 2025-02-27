const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('form input[type="text"]');

fetch("https://api-todo-m5qi.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then( tareas => {

    document.querySelector(".loading").remove();

    tareas.forEach( ({id,tarea,estado}) => {
        new Tarea(id,tarea,estado,contenedorTareas);
    });
});


formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    
    if(inputTexto.value.trim() != ""){

        let tarea = inputTexto.value.trim();
       
        fetch("https://api-todo-m5qi.onrender.com/tareas/nueva", {
            method : "POST",
            body : JSON.stringify({tarea}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id,error}) => {
            if(!error){
                new Tarea(id,tarea,false,contenedorTareas);
                return inputTexto.value = "";
            }
            console.log("error al usuario");
        })
        

    }
});
