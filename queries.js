const mysql = require('mysql');
var url = require('url');
const pool = mysql.createPool({
     host: '127.0.0.1', 
     user: 'pbe', 
     password: 'pbe',
     database: 'cdr',
     port: 3306
});

function objectToArray(obj) {
  return Object.keys(obj).map(key => {
    return {
      parameter : key,
      value: obj[key]
    };
  });
}

function writeResponse(sql, response, table) {
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
      const jsonArray = { [table] : [] };

      results.forEach(result => {
        jsonArray[table].push(result);
      });
      console.log(JSON.stringify(jsonArray));
      response.write(JSON.stringify(jsonArray));
      response.end();
    });
  }) 
}

function searchQuery(request, response) {
  const reqURL = request.url;
  var q = url.parse(reqURL, true); // parseamos la url
  query = objectToArray(q.query);
  const keywords = objectToArray({'[gt]': ' >', '[lt]':' <', '[gte]':' >=', '[lte]':' <='});
  const reserved_key = ['limit'];
  reserved = [{parameter: 'ORDER BY', value :''}];
  var sql="";


  //example.com/marks?subject=abc&name=123
  // FOR PER CAMBIAR: param1[gt] per param1 > per fer la query SQL
  for (let queryObj of query) {
    queryObj.parameter+=' =';
    for(let keywordObj of keywords) {
      if (queryObj.parameter.includes(keywordObj.parameter)) {
        queryObj.parameter=queryObj.parameter.replace(keywordObj.parameter + ' =', keywordObj.value);
        break; //sortir del for ja que sabem que no tenim dos expresions en el matei parametre
      }
    }
    if (queryObj.parameter!='limit =') { // Ignorar el límite temporalmente
      sql = sql + ` AND ${queryObj.parameter} '${queryObj.value}'`;
    }else{
      reserved.push(queryObj);
    }
  }
    for(reservedObj of reserved) {
      if(q.pathname='/tasks')
        sql = sql + ` ${reservedObj.parameter} date ASC`;
      sql = sql + ` ${reservedObj.parameter.replace(' =', '').toUpperCase()} ${reservedObj.value}`;
    }
    return sql +';';
}

module.exports = {searchQuery, writeResponse};

