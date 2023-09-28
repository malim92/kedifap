import axios from "axios";
import moment from "moment";

export const FetchOrdersData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  setData,
  setRowCount,
  setIsError
) => {

  let userId = localStorage.getItem('userId');
  
  const url = new URL(`${process.env.REACT_APP_API_URL}/fetch-orders?customer_id=${userId}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]
  // url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  try {
    const response = await axios.get(url);

    //const json = await response.json();
    const ordersData = response.data.value.map((item) => ({
      ...item,
      TOTPRICE: (parseFloat(item.TOTPRICE) / 100).toFixed(2),
      TOTQUANT: (parseFloat(item.TOTQUANT) / 1000),
      DEXT_SUBMISSIONDATE: moment(item.DEXT_SUBMISSIONDATE).format("DD-MM-YYYY"),
    }));

    setData(ordersData);
    console.log(ordersData, "ordersData 2");
    setRowCount(ordersData.length);
  } catch (error) {
    console.error(error);
  }
};
