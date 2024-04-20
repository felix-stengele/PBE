const mysql = require('mysql');
var url = require('url');
const pool = mysql.createPool({
     host: '127.0.0.1', 
     user: 'pbe', 
     password: 'pbe',
     database: 'db',
     port: 3306
});

function writeResponse(sql, response) {
  pool.getConnection(function(err, connection) {
    if (err){
      console.error('Error al obtener la conexión: ', err)
      return;
    }

    connection.query(sql,function(error, results, fields) {
      connection.release();
      if (error){
        response.writeHead(404, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: 'Error al ejecutar la consulta SQL:', err }));
        response.end()
        return;
      }

      response.writeHead(200, {
        "Content-Type": "application/json",
      });

      response.write(
        JSON.stringify(results));
      response.end();
    });
  }) 
}

function cercaEstudiant(request, response){
    sql = 'SELECT name FROM students WHERE student_id='+url.parse(request.url,true).query.student_id+';';
    writeResponse(sql, response);
}

function searchQuery(request, response) {
  const reqURL = request.url;
  // PARSE
  var q = url.parse(reqURL, true); // parseamos la url
  query = q.query;
  param_keys = Object.keys(q.query); // retorna un array amb els parametres
  param_values = Object.values(q.query); //retorna array amb els valors dels parametres
  const keywordsOb={'[gt]': ' >', '[lt]':' <', '[gte]':' >=', '[lte]':' <='};
  const reserved_key = ['limit'];
  reserved = {}
  var sql="";
  //example.com/marks?subject=abc&name=123
  console.log(query);
  // FOR PER CAMBIAR: param1[gt] per param1 > per fer la query SQL
  for (let clave in query) {
    query[clave]='= ' + query[clave];
    for (let keyword in keywordsOb) {
      if (clave.includes(keyword)) {
        old = clave
        clave = clave.replace(keyword, keywordsOb[keyword]);
        query[clave] = query[old].replace('= ','');
        delete query[old];
        console.log(clave);
      }
      console.log(query);
    }
  }

// SELECT * FROM marks WHERE student_id = 12345678 AND mark < 9 ORDER BY asc AND subject = 'AST' LIMIT 4
  /*for (const reserve of reserved_key) {
    if(query.hasOwnProperty(reserve)) {
      console.log(reserve)
      reserved
    }
  }*/

  /*if (param_keys.length) { //mirem que no tinguem una peticio buida sense parametres
    for (let i = 0; i < reserved_key.length; i++) {
      if (param_keys.includes(reserved_key[i])) {
        reserved_found.push(param_keys.splice(i, 1)[0]);
        reserved_values.push(param_values.splice(i, 1));
        console.log(reserved_found);
      }
    }*/

    /*for (let k = 0; k < param_keys.length; k++) { //for
      param_keys[k] += " =";
      for (let j = 0; j < keywords; j++) {
        if (param_keys[k].includes(keywords[j]))
          param_keys[k] = param_keys[k].replace(keywords[j + " ="], keywords_value[j]);
        console.log(param_keys[k]);
      }
    }*/

    for (const clave in query) {
      sql = sql + ` AND ${clave} ${query[clave]}`;
      console.log(sql);
    }

    /*for (let i = 0; i < param_keys.length; i++) {
      sql = sql + ` AND ${param_keys[i]} = ${param_values[i]}`;
      console.log(sql);
    }
    for (let i = 0; i < reserved_found.length; i++) {
      sql = sql + ` ${reserved_found[i]} ${reserved_values[i]}`;
    }*/
    return sql+';';
  //} 
}

module.exports = { cercaEstudiant, searchQuery, writeResponse};

