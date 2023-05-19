import Cookies from "js-cookie";
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
  let userId = Cookies.get("userId");

  userId =='C1001-01' ? userId = 'C1001' : userId = userId;
  
  const url = new URL(`${process.env.REACT_APP_API_URL}/fetch-orders?customer_id=${userId}`);

  try {
    const response = await axios.get(url);

    //const json = await response.json();
    const ordersData = response.data.value.map((item) => ({
      ...item,
      DEXT_SUBMISSIONDATE: moment(item.DEXT_SUBMISSIONDATE).format("DD-MM-YYYY"),
    }));

    setData(ordersData);
    console.log(ordersData, "ordersData 2");
    setRowCount(ordersData.length);
  } catch (error) {
    console.error(error);
  }
};
