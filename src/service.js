
const config = require('./config.json');
const api_base_url =config.API_URL;

class Service {   
    getApi(path,parameter = '',object = {}) {
        return new Promise(function(resolve, reject) {
            let headers = {}
                headers = {...headers, 'Accept': 'application/json','Content-Type': 'application/json'}
                if(object) {
                    headers = {...headers, ...object}
                }
            fetch(api_base_url+''+path+'?' + new URLSearchParams(parameter),{
                 method: 'GET',
                 headers: headers
            })
            .then((response) => {
                if (!response.ok) {
                      if(response.status === 401) {
                      } else {
                          response.json().then(json => { 
                               reject(json)
                          })
                      }
                } else {
                  if(response){
                      response.json().then(json => { 
                           resolve(json)
                      })
                  } else {
                      resolve('')
                  }
                }
            }).catch((response) => {
                
            });
        });
    }

    postApi(path,body, is_formData = false,object= {} ) {
        return new Promise(function(resolve, reject) {
            let headers = {}
            if(is_formData==false) {
                headers = {...headers, 'Accept': 'application/json','Content-Type': 'application/json'}
            }
            if(object) {
                headers = {...headers, ...object}
            }
            fetch(api_base_url+''+path,{
                method: 'POST',
                headers: headers,
                body: is_formData ? body : JSON.stringify(body)
            })
            .then((response) => {
                if (!response.ok) {
                  if(response.status === 401) {
                  } else {
                    
                      response.json().then(json => { 
                          resolve(json)
                      })
                  }
                } else {
                    console.log(response)
                    if(response){
                          response.json().then(json => { 
                               resolve(json)
                          })
                    } else {
                          resolve('')
                    }
                }
            }).catch((response) => {
                
            });
        });
    }
}
export default Service;

