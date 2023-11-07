import axios from "axios";

export const fetchVendors = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  setData,
  setRowCount,
  setIsError
) => {
  
  const url = new URL(`${process.env.REACT_APP_API_URL}/vendors`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  console.log(url, "url vend xx xx");
  console.log(columnFilters, "url vend columnFilters xx");

  try {
    const response = await axios.get(url);
    console.log(response, "url vend response");
    setData(response.data);
    setRowCount(response.data.length);
  } catch (error) {
    console.error(error);
  }
};
