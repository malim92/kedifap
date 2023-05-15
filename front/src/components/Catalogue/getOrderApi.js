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
  const userId = Cookies.get("userId");
  const url = new URL(
    `https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_ORDERS?$filter=CUSTNAME eq '${userId}'`
  );
  try {
    const response = await axios.get(url, {
      auth: {
        username: "apiuser",
        password: "1234",
      },
    });

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
