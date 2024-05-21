const mysql = require('mysql');
var url = require('url');
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'pbe',
  password: 'pbe',
  database: 'cdr',
  port: 3306
});

function writeResponse(sql, response, table) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error al obtener la conexión: ', err)
      return;
    }

    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: 'Error al ejecutar la consulta SQL:', err }));
        response.end()
        return;
      }

      response.writeHead(200, {
        "Content-Type": "application/json",
      });
      const jsonArray = { [table]: [] };

      results.forEach(result => {
        jsonArray[table].push(result);
      });
      console.log(JSON.stringify(jsonArray));
      response.write(JSON.stringify(jsonArray));
    });
  })
  response.end();
}

function searchQuery(request, response) {
  const date = new Date(Date.now());
  const now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  const url = new URL(request.url, "http://127.0.0.1:9000");
  const params = new URLSearchParams(url.search);
  var sql = "";
  const keywords2 = { '[gt]': ' >', '[lt]': ' <', '[gte]': ' >=', '[lte]': ' <=', 'now': now, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5 };


  //example.com/marks?subject=abc&name=123
  // FOR PER CAMBIAR: param1[gt] per param1 > per fer la query SQL

  for (let [key, value] of params.entries()) {
    for (let [keyword, valueword] of Object.entries(keywords2)) {
      if (key.includes(keyword) && key != 'limit') {
        sql += ` AND ${key.replace(keyword, valueword)}`
        if (value == keyword && key != 'limit')
          sql += ` ${valueword}`;
        else if(key != 'limit')
          sql += ` ${value}`;
        break;
      }
      if(key != 'limit') {
        sql += ` AND ${key}`;
        if (value == keyword)
          sql += ` ${valueword}`;
        else
          sql += ` = ${value}`;
        break;
      }
    }
  }
  console.log("new" +sql);


  // Ordenació per defecte en task. Primer la tasca més propera al dia d'avui
  if (url.pathname == '/tasks')
    sql = sql + ` ORDER BY ABS(DATEDIFF(CURRENT_DATE, date)) ASC`;
  // Ordenació per defecte de timetables. 
  else if (url.pathname == '/timetables') {
    if ("day" in params)
      diaDef = params.day.value;
    else
      diaDef = date.getDay();
    sql = sql + ` ORDER BY FIELD(day`;
    for (let i = 0; i < 6; i++) {
      dia = (diaDef + i) % 6;
      sql = sql + ` , '${dia.toString()}'`;
    }
    sql += ')'
  } else if (url.pathname == 'marks')
    sql = sql;


  // Afegim el limit al final si està inclós en la query.
  if ('limit' in params) {
    sql = `${sql} LIMIT ${params.limit.value}`;
  }
  return sql + ';';
}

module.exports = { searchQuery, writeResponse };

