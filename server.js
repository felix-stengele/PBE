const queries = require('./queries');
var url = require('url');
const http = require('http')
var student_id;
const server = http.createServer((request, response) => {
    const reqMethod = request.method;
    const reqURL = request.url;
    var q = url.parse(reqURL, true);
    table = q.pathname.slice(1); //  cogemos lo que hay antes de ?
                                 //example.com/marks?subject=abc&name=123

    switch (reqMethod) {
      default: {
        defaultHandler(request, response);
      }
      case "GET": {
        console.log("recibido:");
        console.log(q);
        if(table === "students") {
          student_id = q.query.student_id;
          console.log(student_id);
          sql = `SELECT name FROM students WHERE student_id='${url.parse(request.url,true).query.student_id}';`;
          console.log(sql);
          queries.writeResponse(sql, response, table);
        }else{
          sql = `SELECT * FROM ${table} WHERE student = '${student_id}'` + queries.searchQuery(request, response);
          console.log(sql);
          queries.writeResponse(sql, response, table);
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