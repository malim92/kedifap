import axios from "axios";

const getProducts = async () => {
   const response =  await axios.get('http://localhost/kedifap/products/')
                                .catch(err => console.log(err));

    if(response) {
        // console.log(response.data);

        return response.data;
    }

   
};

export default getProducts;