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

  let userId = localStorage.getItem('userId');
  const url = new URL(`${process.env.REACT_APP_API_URL}/statements?customer_id=${userId}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]
  console.log(url, "url statements");

  try {
    const response = await axios.get(url);
    console.log(response, "response statements");

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
