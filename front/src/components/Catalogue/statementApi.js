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

  const url = new URL(`${process.env.REACT_APP_API_URL}/statements`);
  console.log(url, "url invoices");

  try {
    const response = await axios.get(url);
    console.log(response, "response invoices");

    const statementData = response.data.value.map((item) => ({
      ...item,
      TIMESTAMP: moment(item.TIMESTAMP).format(
        "DD-MM-YYYY"
      ),
    }));
    setData(statementData);
    setRowCount(statementData.length);
  } catch (error) {
    console.error(error);
  }
};
