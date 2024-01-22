// import VENDORS from "./VENDORS_DATA.json";
import moment from "moment";

export const FetchPartsData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  setIconDisplay,
  setData,
  setRowCount,
  setIsError,
  barcodeValue,
  supValue,
  activeIngValue,
  discountedProducts,
  quotaProducts,
  isVendorName,
  setIsLoading
) => {

  try {
    setIsLoading(true);
    //const url = new URL("/parts/", "http://localhost:8000");
    const url = new URL("/parts/", `${process.env.REACT_APP_API_URL}`);
    url.searchParams.set("page", `${pagination.pageIndex}`);
    url.searchParams.set("size", `${pagination.pageSize}`);
    url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]
    url.searchParams.set("globalFilter", globalFilter ?? "");
    url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
    if (barcodeValue !== "" && barcodeValue !== undefined) {
      console.log(barcodeValue, "barcodeValue in api");

      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "BARCODE", value: barcodeValue }])
      );
    } else if (supValue !== "" && supValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "vendors.SUPDES", value: supValue }])
      );
    } else if (activeIngValue !== "" && activeIngValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "SPEC1", value: activeIngValue }])
      );
    } else url.searchParams.set("customFilters", "");
    //if user is a vendor

    if (isVendorName) {
      url.searchParams.set(
        "isVendor",
        JSON.stringify([{ value: isVendorName }])
      );
    }
    //if discount switch is on
    if (
      discountedProducts !== "" &&
      discountedProducts !== undefined &&
      discountedProducts !== false
    ) {
      url.searchParams.set(
        "discountFilter",
        JSON.stringify([{ id: "discountFilter", value: discountedProducts }])
      );
    }
    // if quota switch is on
    if (
      quotaProducts !== "" &&
      quotaProducts !== undefined &&
      quotaProducts !== false
    ) {
      url.searchParams.set(
        "quotaFilter",
        JSON.stringify([{ id: "quotaFilter", value: quotaProducts }])
      );
    }

    console.log(url, "url");
    const response = await fetch(url.href);
    const json = await response.json();

    console.log(json.data, "json pro");

    //fetch vendors
    let vendorJson;
    try {
      const vendorUrl = new URL(`${process.env.REACT_APP_API_URL}/vendors`);

      const vendorResponse = await fetch(vendorUrl.href);
      vendorJson = await vendorResponse.json();
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }

    //replace supplier and importer code with name
    let supplierUpdatedArray = json.data.map((item) => {
      let supplierName = vendorJson.find(
        (vName) => vName.SUPNAME === item.SUPNAME
      );

      let distributerName = vendorJson.find(
        (dName) => dName.SUPNAME === item.DEXT_IMPORTERNAME
      );

      if (distributerName && supplierName) {
        return {
          ...item,
          WSPLPRICE: parseFloat(item.WSPLPRICE).toFixed(2),
          VATPRICE: parseFloat(item.VATPRICE).toFixed(2),
          SUPNAME: supplierName.SUPDES,
          DEXT_IMPORTERNAME: distributerName.SUPDES,
        };
      }

      return {
        ...item,
        WSPLPRICE: parseFloat(item.WSPLPRICE).toFixed(2),
        VATPRICE: parseFloat(item.VATPRICE).toFixed(2),
      };
    });

    let stockJson;
    try {
      const stockUrl = new URL("/stock", `${process.env.REACT_APP_API_URL}`);

      const stockResponse = await fetch(stockUrl.href);
      stockJson = await stockResponse.json();
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }

    let stockDetailedJson;
    try {
      const stockDetailedUrl = new URL(
        "/stock-detailed",
        `${process.env.REACT_APP_API_URL}`
      );

      const stockDetailedResponse = await fetch(stockDetailedUrl.href);
      stockDetailedJson = await stockDetailedResponse.json();
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }

    let discountJson;
    try {
      const discountUrl = new URL(
        "/discount",
        `${process.env.REACT_APP_API_URL}`
      );

      const discountResponse = await fetch(discountUrl.href);
      discountJson = await discountResponse.json();
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }

    let updatedArray = supplierUpdatedArray.map((item) => {
      const discountObjs = discountJson.filter(
        (discountItem) => discountItem.DEXT_OFFERPARTNAME === item.PARTNAME
      );

      if (discountObjs.length > 0) {
        setIconDisplay("inline-block");
        console.log(discountObjs, "discountObjs 1");
        const filteredDiscounts = discountObjs.map((discountObj) => ({
          DISCOUNT: discountObj.DISCOUNT,
          OFFERQTY: discountObj.OFFERQTY,
          OFFERNUM: discountObj.OFFERNUM,
          OFFERDES: discountObj.OFFERDES,
          FREEQTY: discountObj.FREEQTY,
          SALES: discountObj.SALES,
          OFFERID: discountObj.OFFERID,
          DEXT_OFFERCODE: discountObj.DEXT_OFFERCODE,
        }));

        if (filteredDiscounts.length > 0) {
          return {
            ...item,
            discounts: filteredDiscounts,
          };
        }
      }
      return item;
    });

    updatedArray = [...new Set(updatedArray.map((item) => item.PARTNAME))].map(
      (partName) => updatedArray.find((item) => item.PARTNAME === partName)
    );

    updatedArray = updatedArray.map((item) => {
      const total = stockJson.reduce((acc, curr) => {
        if (curr.PARTNAME === item.PARTNAME) {
          return parseInt(acc) + parseInt(curr.TBALANCE);
        }
        return acc;
      }, 0);

      const stockObjs = stockDetailedJson.filter(
        (stockItem) => 
          stockItem.PARTNAME === item.PARTNAME
        
      );

      let mostRecentDate;
      
      if (stockObjs && stockObjs.length > 0) {
        mostRecentDate = stockObjs.reduce((previousDate, currentDate) => {
          let previousMoment = moment(previousDate.EXPIRYDATE);
          let currentMoment = moment(currentDate.EXPIRYDATE);

          return currentMoment.isBefore(previousMoment)
            ? currentDate
            : previousDate;
        });
      }

      return {
        ...item,
        stock: total,
        stock_object: stockObjs,
        expectedStock: stockObjs.QTYTORECEIVE ?? 0,
        expiry: mostRecentDate && mostRecentDate.EXPIRYDATE != null
          ? moment(mostRecentDate.EXPIRYDATE).format("DD-MM-YYYY")
          : "0",
      };
    });
    
    //replace return policy code with description
    let returnPolicyArray = updatedArray.map((item) => {
      if (item.DEXT_SUPPOLICYCODE == "6M") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ο Προμηθευτής Δέχεται μόνο Ληξιπρόθεσμα 6Μ",
        };
      } else if (item.DEXT_SUPPOLICYCODE == "6M/EXP") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ο Προμηθευτής Δέχεται Ληγμένα & Ληξιπρόθεσμα 6M",
        };
      } else if (item.DEXT_SUPPOLICYCODE == "ALL") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ο Προμηθευτής Δέχεται Όλες τις Επιστροφές",
        };
      } else if (item.DEXT_SUPPOLICYCODE == "EXP") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ο Προμηθευτής Δέχεται μόνο Ληγμένα",
        };
      } else if (item.DEXT_SUPPOLICYCODE == "NONE") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ο Προμηθευτής ΔΕΝ Δέχεται Επιστροφές",
        };
      } else if (item.DEXT_SUPPOLICYCODE == "SPECIAL") {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: "Ειδική Συμφωνία",
        };
      }
      return item;
    });
    
    console.log(returnPolicyArray, "json pro final");
    setData(returnPolicyArray);
    setRowCount(json.totalRows);
    setIsLoading(false);
  } catch (error) {
    setIsError(true);
    setIsLoading(false);
    console.error(error);
    return;
  }
};
