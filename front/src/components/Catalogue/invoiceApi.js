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
      const url = new URL("/parts/", "https://kedifap-portal.com2go.co/");
      url.searchParams.set("page", `${pagination.pageIndex}`);
      console.log(url, "urls");
      
      const response = await fetch(url.href);
      const json = await response.json();
        
      setData(json);
      setRowCount(json.totalRows);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
  };
  