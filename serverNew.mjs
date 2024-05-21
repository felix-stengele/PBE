//const queries = require('./queries');
import { writeResponse, searchQuery} from './queriesNew.mjs';
//var url = require('url');
import { URL } from 'url';
//const http = require('http');
import http from 'http';
var student_id;
const server = http.createServer((request, response) => {
    const reqMethod = request.method;
    const reqURL = request.url;
    var q = new URL(reqURL, `http://${request.headers.host}`);
    var table = q.pathname.slice(1); //  cogemos lo que hay antes de ?
                                 //example.com/marks?subject=abc&name=123

    switch (reqMethod) {
      default: {
        defaultHandler(request, response);
      }
      case "GET": {
        if(table === "students") {
          student_id = q.searchParams.get('student_id');
          var sql = `SELECT name FROM students WHERE student_id='${student_id}';`;
          writeResponse(sql, response, table);
        }else{
          var sql = `SELECT * FROM ${table} WHERE student = '${student_id}'` + searchQuery(request, response);
          console.log(sql);
          writeResponse(sql, response, table);
        }
      }
    }
});
 
  const port = 9000; // Puerto en el que el servidor escuchara
  const host = '0.0.0.0';

// Iniciar el servidor y hacerlo escuchar en el puerto especificado
server.listen(port, host, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});