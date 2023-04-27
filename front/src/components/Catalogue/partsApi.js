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
  setIsError
) => {
  try {
    //const url = new URL("/parts/", "http://localhost:8000");
    const url = new URL("/parts/", "https://kedifap-portal.com2go.co/");
    url.searchParams.set("page", `${pagination.pageIndex}`);
    url.searchParams.set("size", `${pagination.pageSize}`);
    url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
    url.searchParams.set("globalFilter", globalFilter ?? "");
    url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
    console.log(url, "urls");

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
    console.log(updatedArray, "result");
    //console.log(stockData, "stockData");

    // const stockUrl = new URL( "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_PARTBAL?$filter=PARTNAME%20eq%20%27LP01059%27");
    // const stockResponse = await fetch(stockUrl.href);
    // const stockJson = await stockResponse.json();
    // console.log(stockJson.value,'stockJson');

    setData(updatedArray);
    setRowCount(json.totalRows);
  } catch (error) {
    setIsError(true);
    console.error(error);
    return;
  }
};
