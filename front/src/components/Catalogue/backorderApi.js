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

  let userId = localStorage.getItem('userId');
  const url = new URL(`${process.env.REACT_APP_API_URL}/backorders?customer_id=${userId}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]
  url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
  console.log(url, "url backorders");

  try {
    const response = await axios.get(url);
    console.log(response, "response backorders");

    const backordersData = response.data.map((item) => ({
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
