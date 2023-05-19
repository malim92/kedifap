import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";

export const FetchBackordersData = async (
  sorting,
  globalFilter,
  columnFilters,
  pagination,
  setData,
  setRowCount,
  setIsError
) => {
  const userId = Cookies.get("userId");
  const url = new URL(`${process.env.REACT_APP_API_URL}/backorders`);
  console.log(url, "url backorders");

  try {
    const response = await axios.get(url);

    const backordersData = response.data.value.map((item) => ({
      ...item,
      DEXT_SUBMISSIONDATE: moment(item.DEXT_SUBMISSIONDATE).format(
        "DD-MM-YYYY"
      ),
    }));

    console.log(backordersData, "backordersData 1");

    setData(backordersData);
    setRowCount(backordersData.length);
  } catch (error) {
    console.error(error);
  }
};
