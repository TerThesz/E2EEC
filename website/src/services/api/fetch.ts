export default ( uri: string, method: string = 'GET', body: any = null, headers: any = { 'content-type': 'application/json' } ): any =>
  new Promise((resolve, reject) => {
    fetch('http://localhost:5000/' + uri, {
      method,
      body,
      headers,
    })
      .then((response) => response.json())
      .then((json) => {
        json.cod = json.cod.toString();

        if (json.cod[0] === '2' || json.cod[0] === '3') resolve(json.cod);
        else if (json.cod[0] === '5' || json.cod === '404') throw json.cod;
        else reject(parseInt(json.cod));
      })
      .catch((err) => {
          throw err;
      });
  });