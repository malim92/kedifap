import React, { useState } from "react";
import axios from "axios";

import "./ReturnPolicy.css";

function ReturnPolicy() {
  const [id, setId] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [productDesciption, setProductDesciption] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = new URL(
      `${process.env.REACT_APP_API_URL}/return-policy?barcode=${id}`
    );
    try {
      const response = await axios.get(url, { id });
      console.log(returnPolicy, "returnPolicy");
      setShowPolicy(true);
      setReturnPolicy(response.data);
      // response.data !=''
      //   ? (setShowPolicy(true) && setReturnPolicy(response.data))
      //   : setShowPolicy(true) && setReturnPolicy('No privacy policy found!!') ;

      // response.data
      //   ? (returnPolicyArray = response.data) && (productDesciptionArray = response.data)
      //   : setReturnPolicy("No product found!!") && setProductDesciption('');


      //   productDesciptionArray !== null && productDesciptionArray.length > 0
      //   ? setProductDesciption(productDesciptionArray): setProductDesciption("");

      // returnPolicyArray !== null && returnPolicyArray.length > 0
      //   ? setShowPolicy(true)
      //   : setShowPolicy(true) && setReturnPolicy("No product found");
      // //   console.log(returnPolicyArray.length , "returnPolicyArray length");

      // if (returnPolicyArray == "6M") {
      //   setReturnPolicy("Ο Προμηθευτής Δέχεται μόνο Ληξιπρόθεσμα 6Μ");
      // } else if (returnPolicyArray == "6M/EXP") {
      //   setReturnPolicy("Ο Προμηθευτής Δέχεται Ληγμένα & Ληξιπρόθεσμα 6M");
      // } else if (returnPolicyArray == "ALL") {
      //   setReturnPolicy("Ο Προμηθευτής Δέχεται Όλες τις Επιστροφές");
      // } else if (returnPolicyArray == "EXP") {
      //   setReturnPolicy("Ο Προμηθευτής Δέχεται μόνο Ληγμένα");
      // } else if (returnPolicyArray == "NONE") {
      //   setReturnPolicy("Ο Προμηθευτής ΔΕΝ Δέχεται Επιστροφές");
      // } else if (returnPolicyArray == "SPECIAL") {
      //   setReturnPolicy("Ειδική Συμφωνία");
      // } else if (returnPolicyArray ==null )
      //   setReturnPolicy("No policy was found for the selected product");

      
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setId(event.target.value);
  };

  return (
    <>
    {console.log(returnPolicy, "returnPolicy 2")}
    {console.log(productDesciption, "productDesciption 2")}
      <div className="container">
        <h1 className="text-2xl py-4">Πολιτική επιστροφών</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idInput">Barcode:</label>
            <input
              type="text"
              className="form-control"
              id="idInput"
              value={id}
              onChange={handleChange}
            />
            <button
              className="btn btn-primary"
              style={{
                fontSize: "15px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Request Πολιτική επιστροφών
            </button>
          </div>
        </form>
      </div>
      {productDesciption && (
        <div className="container form-group desc">
          <div className="text-bg">{productDesciption}</div>
        </div>
      )}
      {showPolicy && (
        <div className="container form-group policy">
          <div className="text-bg">{returnPolicy}</div>
        </div>
      )}
      
    </>
  );
}

export default ReturnPolicy;
