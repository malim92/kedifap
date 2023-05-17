import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";

export const FetchStatementsData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  setData,
  setRowCount,
  setIsError
) => {
  const userId = Cookies.get("userId");

  const todayDate = moment().format("YYYY-MM-DD");
  const lastYearDate = moment().subtract(1, "year").format("YYYY-MM-DD");

  const url = new URL(
    `https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/DEXT_CUSTSTMT?$filter=FROMDATE ge ${lastYearDate} and TODATE le ${todayDate} and CUSTNAME eq '${userId}'`
  );
  console.log(url, "statementsData url");

  try {
    const response = await axios.get(url, {
      auth: {
        username: "apiuser",
        password: "1234",
      },
    });

    const statementsData = response.data.value.map((item) => ({
      ...item,
      TIMESTAMP: moment(item.TIMESTAMP).format("DD-MM-YYYY"),
    }));
    console.log(statementsData, "statementsData 1");

    setData(statementsData);
    setRowCount(statementsData.length);
  } catch (error) {
    console.error(error);
  }
};
