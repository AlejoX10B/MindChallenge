# Mind Challenge

## Database server
Para ejecutar el servicio que simula la conexión al backend, hay que hacer uso del paquete [**json-server**](https://www.npmjs.com/package/json-server#getting-started)
de **npm**

* Se instala el paquete json-server
```
npm i -g json-server
```

* En la ruta del proyecto ejecutamos el siguiente comando para montar el servidor, apuntando a la ruta donde se encuentra la base de datos falsa:
```
json-server --watch database/db.json
```

