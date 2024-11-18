const formulario = document.querySelector("form");
const inputText = document.querySelector('form input[type="text"]');
const contenedorTareas = document.querySelector(".tareas");

//carga inicial de los datos
fetch("https://api-todo-6eul.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then(tareas => {
    
    tareas.forEach(({id,tarea,estado}) => {
        new Tarea(id,tarea,estado,contenedorTareas);
    });

});


formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if(inputText.value.trim() != ""){

        let tarea = inputText.value.trim();
        
        fetch("https://api-todo-6eul.onrender.com/tareas/nueva",{
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
                return inputText.value = "";
            }
            console.log("..mostrar error al usuario");
        });

    }
    
})

