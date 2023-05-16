import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Vendors.css";

const fetchVendors = async () => {
  const url = new URL(
    `https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_SUPPLIERS?$filter=STATDES eq 'Active'`
  );

  try {
    const response = await axios.get(url, {
      auth: {
        username: "apiuser",
        password: "1234",
      },
    });

    return response.data.value;
  } catch (error) {
    console.error(error);
  }
};

function Vendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchAndSetVendors = async () => {
      const data = await fetchVendors();
      setVendors(data);
    };

    fetchAndSetVendors();
  }, []);

  return (
    <>
      {vendors.map((vendor) => (
        <div key={vendor.SUPNAME}>
          <div className="person-info">
            <h2 className="person-name">{vendor.SUPDES}</h2>
            <div className="person-details">
              <p className="person-info-item">Address: {vendor.ADDRESS}</p>
              <p className="person-info-item">District: {vendor.STATEA}</p>
              <p className="person-info-item">Country: {vendor.COUNTRYNAME}</p>
              <p className="person-info-item">Phone: {vendor.PHONE}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Vendors;
