class Tarea{
    constructor(id,texto,estado,contenedor){
        this.id = id;
        this.texto = texto;
        this.DOM = null; //componente HTML
        this.editando = false; //estado del objeto tarea, representa si el usuario estó o no editando el texto
        this.crearTarea(estado,contenedor);
    }
    crearTarea(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.texto;

        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");
        editorTarea.value = this.texto;

        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => this.actualizarTexto());

        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click", () => {
            this.borrarTarea();
        });

        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${ estado ? "terminada" : "" }`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.actualizarEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(() => console.log("..mostrar error a usuario"));
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    borrarTarea(){
       fetch("https://api-todo-m5qi.onrender.com/tareas/borrar/" + this.id, { method : "DELETE" })
       .then(respuesta => {
            if(respuesta.status == 204){
                return this.DOM.remove();
            }
            console.log("...mostrar error al usuario");
       });
    }
    actualizarEstado(){
        return new Promise((ok,ko) => {
            fetch("https://api-todo-m5qi.onrender.com/tareas/editar/estado/" + this.id, { method : "PUT" })
            .then(respuesta => {
                if(respuesta.status == 204){
                    return ok();
                }
                ko();
            });
        });
    }
    async actualizarTexto(){
        if(this.editando){
            //guardar los cambios en caso de que haya
            let textoTemporal = this.DOM.children[1].value.trim();

            if(textoTemporal != "" && textoTemporal != this.texto){

                let resultado = await fetch("https://api-todo-m5qi.onrender.com/tareas/editar/texto/" + this.id, {
                    method : "PUT",
                    body : JSON.stringify({ tarea : textoTemporal }),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then( respuesta => respuesta.text() );

                if(resultado.length == 0){
                    this.texto = textoTemporal;
                }else{
                    console.log("mostrar error al usuario");
                }

            }
            
            //toggle de las clases
            this.DOM.children[1].classList.remove("visible");//input
            this.DOM.children[0].innerText = this.texto;//h2
            this.DOM.children[0].classList.add("visible");//h2
            //cambiar el texto del botón
            this.DOM.children[2].innerText = "editar";//botón editar
        }else{
            //empezar a editar
            //toggle de clases
            this.DOM.children[0].classList.remove("visible");//h2
            this.DOM.children[1].value = this.texto;//input
            this.DOM.children[1].classList.add("visible");//input
            //cambiar el texto del botón
            this.DOM.children[2].innerText = "guardar";//botón editar

        }
        this.editando = !this.editando;
    }
}