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
  console.log(url, "url vend xx xx");

  try {
    const response = await axios.get(url);
    setData(response.data.value);
    setRowCount(response.data.value.length);
  } catch (error) {
    console.error(error);
  }
};
