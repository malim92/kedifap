import VENDORS from "./VENDORS_DATA.json";

export const FetchPartsData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  discountData,
  stockData,
  setIconDisplay,
  setData,
  setRowCount,
  setIsError,
  barcodeValue,
  supValue,
  activeIngValue
) => {
  try {
    //const url = new URL("/parts/", "http://localhost:8000");
    const url = new URL("/parts/", "https://kedifap-portal.com2go.co/");
    url.searchParams.set("page", `${pagination.pageIndex}`);
    url.searchParams.set("size", `${pagination.pageSize}`);
    url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]
    url.searchParams.set("globalFilter", globalFilter ?? "");
    url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
    if (barcodeValue !== "" && barcodeValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "BARCODE", value: barcodeValue }])
      );
    } else if (supValue !== "" && supValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "SUPNAME", value: supValue }])
      );
    } else if (activeIngValue !== "" && activeIngValue !== undefined) {
      url.searchParams.set(
        "customFilters",
        JSON.stringify([{ id: "SPEC1", value: activeIngValue }])
      );
    } else url.searchParams.set("customFilters", "");
    ///parts/?page=0&size=20&filters=%5B%7B%22id%22%3A%22PARTNAME%22%2C%22value%22%3A%22sa%22%7D%5D&globalFilter=&sorting=%5B%5D
    console.log(url, "url");
    const response = await fetch(url.href);
    const json = await response.json();

    //replace supplier and importer code with name
    let supplierUpdatedArray = json.data.map((item) => {
      const supplierName = VENDORS.value.find(
        (vName) => vName.SUPNAME === item.SUPNAME
      );
      const distributerName = VENDORS.value.find(
        (dName) => dName.SUPNAME === item.DEXT_IMPORTERNAME
      );
      if (distributerName || supplierName) {
        return {
          ...item,
          SUPNAME: supplierName.SUPDES,
          DEXT_IMPORTERNAME: distributerName.SUPDES,
        };
      }
      return item;
    });

    let updatedArray = supplierUpdatedArray.map((item) => {
      const discountObjs = discountData.filter(
        (discountItem) => discountItem.DEXT_OFFERPARTNAME === item.PARTNAME
      );

      if (discountObjs.length > 0) {
        setIconDisplay("inline-block");
        return {
          ...item,
          discounts: discountObjs
            .map((discountObj) => {
              if (discountObj.OFFERDES.startsWith("SO")) {
                return {
                  DISCOUNT: discountObj.DISCOUNT,
                  OFFERQTY: discountObj.OFFERQTY,
                  OFFERNUM: discountObj.OFFERNUM,
                  OFFERDES: discountObj.OFFERDES,
                };
              }
              return null;
            })
            .filter((discount) => discount !== null),
        };
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

      return { ...item, stock: total };
    });

    //replace return policy code with description
    let returnPolicyArray = updatedArray.map((item) => {

      if ( item.DEXT_SUPPOLICYCODE == '6M') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ο Προμηθευτής Δέχεται μόνο Ληξιπρόθεσμα 6Μ',
        };
      }
      else if ( item.DEXT_SUPPOLICYCODE == '6M/EXP') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ο Προμηθευτής Δέχεται Ληγμένα & Ληξιπρόθεσμα 6M',
        };
      }
      else if ( item.DEXT_SUPPOLICYCODE == 'ALL') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ο Προμηθευτής Δέχεται Όλες τις Επιστροφές',
        };
      }
      else if ( item.DEXT_SUPPOLICYCODE == 'EXP') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ο Προμηθευτής Δέχεται μόνο Ληγμένα',
        };
      }
      else if ( item.DEXT_SUPPOLICYCODE == 'NONE') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ο Προμηθευτής ΔΕΝ Δέχεται Επιστροφές',
        };
      }
      else if ( item.DEXT_SUPPOLICYCODE == 'SPECIAL') {
        return {
          ...item,
          DEXT_SUPPOLICYCODE: 'Ειδική Συμφωνία',
        };
      }

      // const supplierName = VENDORS.value.find(
      //   (vName) => vName.SUPNAME === item.SUPNAME
      // );

      // if ( supplierName) {
      //   return {
      //     ...item,
      //     SUPNAME: supplierName.SUPDES,
      //   };
      // }

      return item;
    });

    console.log(returnPolicyArray, "result");
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
