export const FetchInvoiceData = async (
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
      const url = new URL("https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/DEXT_APINVOS");
      console.log(url, "urls");
      
      const response = await fetch(url.href);
      const json = await response.json();
      console.log(json, "json");
      setData(json);
      setRowCount(json.totalRows);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
  };
  