import React, { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./ReturnPolicy.css";

function ReturnPolicy() {
  const [id, setId] = useState("");
  const [kdId, setKdId] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [productDesciption, setProductDesciption] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formName = event.target.name;
    let url;
    if (formName == "barcode") {
      url = new URL(
        `${process.env.REACT_APP_API_URL}/return-policy?barcode=${id}`
      );
    } else {
      url = new URL(
        `${process.env.REACT_APP_API_URL}/return-policy?kdcode=${kdId}`
      );
    }

    try {
      const response = await axios.get(url, { id });
      // Handle the response from the backend here
      console.log(response, "response return policy");

      let returnPolicyArray = "";
      let productDesciptionArray = "";
      response.data.value[0]
        ? (returnPolicyArray = response.data.value[0].DEXT_CSPOLICYCODE) &&
          (productDesciptionArray = response.data.value[0].PARTDES)
        : setReturnPolicy("No product found!!") && setProductDesciption("");

      productDesciptionArray !== null && productDesciptionArray.length > 0
        ? setProductDesciption(productDesciptionArray)
        : setProductDesciption("");

      returnPolicyArray !== null && returnPolicyArray.length > 0
        ? setShowPolicy(true)
        : setShowPolicy(true) && setReturnPolicy("No product found");
      //   console.log(returnPolicyArray.length , "returnPolicyArray length");

      if (returnPolicyArray == "6M") {
        setReturnPolicy("Ο Προμηθευτής Δέχεται μόνο Ληξιπρόθεσμα 6Μ");
      } else if (returnPolicyArray == "6M/EXP") {
        setReturnPolicy("Ο Προμηθευτής Δέχεται Ληγμένα & Ληξιπρόθεσμα 6M");
      } else if (returnPolicyArray == "ALL") {
        setReturnPolicy("Ο Προμηθευτής Δέχεται Όλες τις Επιστροφές");
      } else if (returnPolicyArray == "EXP") {
        setReturnPolicy("Ο Προμηθευτής Δέχεται μόνο Ληγμένα");
      } else if (returnPolicyArray == "NONE") {
        setReturnPolicy("Ο Προμηθευτής ΔΕΝ Δέχεται Επιστροφές");
      } else if (returnPolicyArray == "SPECIAL") {
        setReturnPolicy("Ειδική Συμφωνία");
      } else if (returnPolicyArray == null)
        setReturnPolicy("No policy was found for the selected product");
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setId(event.target.value);
  };

  const handleKdCode = (event) => {
    setKdId(event.target.value);
  };

  return (
    <>
      <h1 className="text-2xl py-4">Πολιτική επιστροφών</h1>
      <Container>
        <Row>
          <Col>
            <form name="barcode" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="idInput">Barcode Συσκευασίας:</label>
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
          </Col>
          <Col>
            <form name="kdcode" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="kdInput">Barcode KEDIFAP:</label>
                <input
                  type="text"
                  className="form-control"
                  id="kdInput"
                  value={kdId}
                  onChange={handleKdCode}
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
          </Col>
        </Row>
      </Container>

      {productDesciption && (
        <div className="container form-group">
          <div className="text-bg">{productDesciption}</div>
        </div>
      )}
      {showPolicy && (
        <div className="container form-group">
          <div className="text-bg">{returnPolicy}</div>
        </div>
      )}
    </>
  );
}

export default ReturnPolicy;
