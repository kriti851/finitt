

const config = require('./config.json');
const api_base_url =config.API_URL;
function  customerRedirect(){
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_detail'); 
    window.location.href = '/login';
}





class Service {
    
    
    getApi(path,parameter = '') {
        return new Promise(function(resolve, reject) {
            let headers = {}
                headers = {...headers, 'Accept': 'application/json','Content-Type': 'application/json'}
            if(localStorage.getItem("user_token")!=null && localStorage.getItem("user_token")!=undefined && localStorage.getItem("user_token")!='') {
                headers = {...headers, 'Auth-Token' : localStorage.getItem("user_token")}
            }
            fetch(api_base_url+''+path+'?' + new URLSearchParams(parameter),{
                 method: 'GET',
                 headers: headers
            })
            .then((response) => {
                if (!response.ok) {
                      if(response.status === 401) {
                         customerRedirect();
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

    postApi(path,body, is_formData = false ) {
        return new Promise(function(resolve, reject) {
            let headers = {}
            if(is_formData==false) {
                headers = {...headers, 'Accept': 'application/json','Content-Type': 'application/json'}
            }
            if(localStorage.getItem("user_token")!=null && localStorage.getItem("user_token")!=undefined && localStorage.getItem("user_token")!='') {
                headers = {...headers, 'Auth-Token' : localStorage.getItem("user_token")}
            }
            fetch(api_base_url+''+path,{
                method: 'POST',
                headers: headers,
                body: is_formData ? body : JSON.stringify(body)
            })
            .then((response) => {
                if (!response.ok) {
                   console.log(response.status)
                  if(response.status === 401) {
                       customerRedirect();
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

}
export default Service;

