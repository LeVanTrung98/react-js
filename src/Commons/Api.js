import axios from "axios";

let baseURL ='http://localhost:3000/';

var FetchData = (url, method = "GET") => {
    return async (method, data) => {
        try {
            return await axios({
                method : method,
                url : baseURL + url,
                data,
                responseType : "json"
            }).then( response => response.status == 200 && response );
        } catch (error) {
            console.log(error);
        }
    }
}
export { FetchData };