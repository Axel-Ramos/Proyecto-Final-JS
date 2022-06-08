const contenerStock=document.getElementById("carrito");
const carritoProductos=document.getElementById("productosCarrito")
const carritoActivo=document.getElementById("cantidadCompra")
document.addEventListener('DOMContentLoaded', () => {    
    //Traigo los productos con un fetch
    const fetchData = async () => {
        try{
            const url = await fetch ('productos.json');
            const data = await url.json();
            pintarData(data)    
        }
        catch{
            console.log('Error al obtener el fetch')
        }        
    }
    //Paso los datos de los productos al DOM
    const pintarData = (data) => {    
        Object.values(data).forEach(producto => {
            const listaProductos=document.createElement("div");
            listaProductos.setAttribute("class","productos");
            listaProductos.innerHTML=`
            <h1 class="nombreProducto">${producto.nombre}</h1>
            <img src="${producto.imagen}" alt="Imagen ${producto.nombre}" class="imageni">
            <h2 class="contenidoProductos">${producto.precio}</h2>
            <h4 class="contenidoProductos">${producto.unidad} unidad/es</h4>
            <button data-id="${producto.id}" class="botonProductos">Comprar</button>`
            contenerStock.append(listaProductos);
        });     
    };
    fetchData();
    localStorage.clear();
    //Seteo todos los eventos de click
    document.addEventListener("click", (e)=>{        
        if(e.target.matches(".botonProductos")){
            //Eligo los botones de los productos y agarro los que quiero tener en el LS
            const producto = e.target.parentElement;
            const productoCarrito={
                id:producto.querySelector("button").dataset.id,
                nombre:producto.querySelector("h1").textContent,
                precio:producto.querySelector("h2").textContent,
                cantidad:1
            }    
            //Seteo el array carrito
            const carrito = JSON.parse(localStorage.getItem('productos')) || [];            
            // Agregar nuevo item
            const indiceProducto = carrito.findIndex( (elemento) => {
                return elemento.nombre === productoCarrito.nombre;
            });    
            if(indiceProducto === -1) { 
                // El producto no está agregado
                productoCarrito.cantidad = 1;
                carrito.push(productoCarrito);
            }else { 
                // El producto está en el array de productos encontrados
                const productoEncontrado = carrito[indiceProducto];
                productoEncontrado.cantidad++;
                carrito[indiceProducto] = productoEncontrado;
            }
            // Setear el localStorage
            localStorage.setItem("productos", JSON.stringify(carrito));
            if (carrito.hasOwnProperty(productoCarrito.id)){
                productoCarrito.cantidad=carrito[productoCarrito.id].cantidad++;
                carrito.push(productoCarrito)
            }
            //Seteo cantidad de productos carrito actico
            cantidadCompra();
            //Vacio el div del carrito
            carritoProductos.innerHTML="";
            //Pinto los productos en el DOM
            pintarProductos();
        }
        //Seteo el boton para aumentar la cantidad de cada producto seleccionado
        if(e.target.matches(".cambio-mas")){
            sumarCantidad=e.target.parentElement.parentElement;
            const productoCarrito={
                cantidad:sumarCantidad.querySelector("#cantidadProducto"),
                precio:parseInt(sumarCantidad.querySelector("#precioProducto"))
            }
            productoCarrito.cantidad.innerHTML++
            productoCarrito.precio.innerHTML=productoCarrito.cantidad*productoCarrito.precio
        }
        //Seteo el boton para diminuir la cantidad de cada producto seleccionado
        if(e.target.matches(".cambio-menos")){
            restarCantidad=e.target.parentElement.parentElement;
            const productoCarrito={
                cantidad:restarCantidad.querySelector("#cantidadProducto")
            }
            productoCarrito.cantidad.innerHTML--
            if(productoCarrito.cantidad.innerHTML<= 0){
                e.target.parentElement.parentElement.remove()
            }
        }
        //Seteo el boton para vaciar el carrito
        if(e.target.matches("#botonVaciar")){
            localStorage.clear();
            carritoProductos.innerHTML=""
            carritoActivo.innerHTML="0"

        }
        //Seteo el boton para realizar la compra
        if(e.target.matches("#botonComprar")){
            Swal.fire({
                title: 'Muchas Gracias',
                text: 'Su compra esta siendo procesada',
                icon: 'success',
                confirmButtonText: 'Ok',
            })
        }    
    });

});
const pintarProductos=()=>{
    productosElegidos=JSON.parse(localStorage.getItem("productos"));
    for(i=0;i<=productosElegidos.length;i++){
        agregarProductosHTML(productosElegidos[i])
    }
}
function agregarProductosHTML(producto){
    //seteo la lista
    let tablaCarrito=document.createElement("table");
    tablaCarrito.setAttribute=("class", "carrito")
    tablaCarrito.setAttribute=("id", "carrito")

    //Agrego columna Nombre
    let columnaNombre=document.createElement("td");
    columnaNombre.innerText = producto.nombre ;
    columnaNombre.setAttribute("class","compras-JS");

    //Agrego columna Cantidad
    let columnaCantidad=document.createElement("td");
    columnaCantidad.innerText = producto.cantidad ;
    columnaCantidad.setAttribute("class","compras-JS");
    columnaCantidad.setAttribute("id","cantidadProducto");

    //Agrego columna Cambios con sus botones
    let columnaCambios=document.createElement("td");
    columnaCambios.setAttribute("class","compras-JS");

    //Boton sumas cantidad
    let cambioMas=document.createElement("button");
    cambioMas.innerText="+";
    cambioMas.setAttribute("class", "cambio-mas");

    //Boton restan cantidad
    let cambioMenos=document.createElement("button");
    cambioMenos.innerText="-"
    cambioMenos.setAttribute("class", "cambio-menos");

    //Agrego columna Precio
    let columnaPrecio=document.createElement("td");
    columnaPrecio.innerText = producto.precio*producto.cantidad ;
    columnaPrecio.setAttribute("class","compras-JS");
    columnaPrecio.setAttribute("id","precioProducto");

    //Anexo las columnas al DOM
    columnaCambios.append(cambioMas, cambioMenos);
    tablaCarrito.append(columnaNombre, columnaCantidad, columnaCambios, columnaPrecio);
    carritoProductos.append(tablaCarrito);    
};
const cantidadCompra=()=>{
    carritoAct=JSON.parse(localStorage.getItem("productos"));
    carritoActivo.innerHTML=carritoAct.length
}