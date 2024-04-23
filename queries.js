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
  const date = new Date(Date.now());
  const now = date.getFullYear()+ '-' + (date.getMonth()+1) + '-' + date.getDate();
  const reqURL = request.url;
  var q = url.parse(reqURL, true); // parseamos la url
  query = objectToArray(q.query);
  const keywords = objectToArray({'[gt]': ' >', '[lt]':' <', '[gte]':' >=', '[lte]':' <=', 'now': now,'Mon': 1, 'Tue': 2,'Wed': 3, 'Thu': 4, 'Fri':5});
  var sql="";


  //example.com/marks?subject=abc&name=123
  // FOR PER CAMBIAR: param1[gt] per param1 > per fer la query SQL
  for (let queryObj of query) {
    queryObj.parameter+=' =';
    for(let keywordObj of keywords) {
      if (queryObj.parameter.includes(keywordObj.parameter)) {
        queryObj.parameter=queryObj.parameter.replace(keywordObj.parameter + ' =', keywordObj.value);
      }
      if (queryObj.value==keywordObj.parameter)
        queryObj.value=keywordObj.value;
    }
    if(queryObj.parameter != 'limit =')
      sql = sql + ` AND ${queryObj.parameter} '${queryObj.value}'`;
  }
  console.log(query);


  // Ordenació per defecte en task. Primer la tasca més propera al dia d'avui
  if (q.pathname == '/tasks')
    sql = sql + ` ORDER BY ABS(DATEDIFF(CURRENT_DATE, date)) ASC`;
  // Ordenació per defecte de timetables. 
  else if (q.pathname == '/timetables') {
    if(query.some(obj => Object.values(obj).includes("day =")))
      diaDef = (query.find(obj => obj.parameter == 'day =')).value;
    else
      diaDef = date.getDay();
    sql = sql + ` ORDER BY FIELD(day`;
    for(let i=0; i<6;i++) {
      dia = (diaDef+i)%6;
      sql = sql + ` , '${dia.toString()}'`;
    }
    sql+=')'
  } else if (q.pathname == 'marks')
    sql = sql;


  // Afegim el limit al final si està inclós en la query.
  const limitObj = query.find(obj => obj.parameter === 'limit =');
  if (limitObj) {
    sql = `${sql} LIMIT ${limitObj.value}`;
  }
  return sql + ';';
}

module.exports = {searchQuery, writeResponse};

