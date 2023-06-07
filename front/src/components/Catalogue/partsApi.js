import VENDORS from "./VENDORS_DATA.json";
import moment from "moment";

export const FetchPartsData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  stockData,
  setIconDisplay,
  setData,
  setRowCount,
  setIsError,
  barcodeValue,
  supValue,
  activeIngValue,
  discountedProducts,
  quotaProducts,
  isVendorName
) => {
  // if (isVendorName.startsWith('V')) userTest = isVendorName;

  try {
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
    }
    else if (supValue !== "" && supValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "vendors.SUPDES", value: supValue }])
      );
    }
    else if (activeIngValue !== "" && activeIngValue !== undefined) {
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
    //if quota switch is on
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
    console.log(response, "response test");

    //replace supplier and importer code with name
    let supplierUpdatedArray = json.data.map((item) => {
      const supplierName = VENDORS.value.find(
        (vName) => vName.SUPNAME === item.SUPNAME
      );
      const distributerName = VENDORS.value.find(
        (dName) => dName.SUPNAME === item.DEXT_IMPORTERNAME
      );
      if (distributerName !== null || supplierName !== null) {
        console.log(distributerName, "distributerName test 1");

        return {
          ...item,
          SUPNAME: supplierName.SUPDES,
          DEXT_IMPORTERNAME: distributerName.SUPDES,
        };
      }
      return item;
    });

    // if (supValue !== "") {
    // console.log(supValue, "supValue");
    //   supValue = supValue.toLowerCase();
    //   supplierUpdatedArray = supplierUpdatedArray.filter(
    //     (supplierNameInArray) =>
    //       supplierNameInArray.DEXT_IMPORTERNAME.toLowerCase().includes(supValue)
    //   );
    // }

    let discountJson;
    try {
      const url = new URL("/discount", `${process.env.REACT_APP_API_URL}`);
      const discountUrl = new URL(
        "/discount/",
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
        const filteredDiscounts = discountObjs
          .filter((discountObj) => discountObj.OFFERDES.startsWith("SO"))
          .map((discountObj) => ({
            DISCOUNT: discountObj.DISCOUNT,
            OFFERQTY: discountObj.OFFERQTY,
            OFFERNUM: discountObj.OFFERNUM,
            OFFERDES: discountObj.OFFERDES,
            FREEQTY: discountObj.FREEQTY,
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

    // let stockupdatedArray = json.data.map((item) => {
    //     const sotckObjs = stockData.filter(
    //       (stockItem) => stockItem.PARTNAME === item.PARTNAME
    //     );

    //     console.log(sotckObjs, "sotckObjs");
    //     // if (sotckObjs.length > 0) {
    //     //   return {
    //     //     ...item,
    //     //     stock: sotckObjs.map((discountObj) => ({
    //     //       DISCOUNT: discountObj.DISCOUNT,
    //     //       OFFERQTY: discountObj.OFFERQTY,
    //     //     })),
    //     //   };
    //     // }
    //     // return item;
    //   });
    updatedArray = updatedArray.map((item) => {
      const total = stockData.reduce((acc, curr) => {
        if (curr.PARTNAME === item.PARTNAME) {
          return acc + curr.TBALANCE;
        }
        return acc;
      }, 0);

      const expiryDateCol = stockData.reduce((acc, curr) => {
        if (curr.PARTNAME === item.PARTNAME) {
          acc = moment(curr.EXPIRYDATE).format("DD-MM-YYYY");
        }
        return acc;
      }, 0);

      return { ...item, stock: total, expiry: expiryDateCol };
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

    console.log(returnPolicyArray, "result 2");
    //console.log(stockData, "stockData");

    // const stockUrl = new URL( "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_PARTBAL?$filter=PARTNAME%20eq%20%27LP01059%27");
    // const stockResponse = await fetch(stockUrl.href);
    // const stockJson = await stockResponse.json();
    // console.log(stockJson.value,'stockJson');

    setData(returnPolicyArray);
    setRowCount(json.totalRows);
  } catch (error) {
    setIsError(true);
    console.error(error);
    return;
  }
};
