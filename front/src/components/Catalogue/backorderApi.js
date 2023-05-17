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
    const url = new URL(
      `https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_BACKORDERS?$filter=CUSTNAME eq '${userId}'`);
      console.log(url, "url backordersData 1");

    try {
      const response = await axios.get(url, {
        auth: {
          username: "apiuser",
          password: "1234",
        },
      });
      
      console.log(response.data.value, "response.data.value backordersData 1");

      const backordersData = response.data.value.map((item) => ({
        ...item,
        DEXT_SUBMISSIONDATE: moment(item.DEXT_SUBMISSIONDATE).format("DD-MM-YYYY"),
      }));
  
      console.log(backordersData, "backordersData 1");
  
      setData(backordersData);
      setRowCount(backordersData.length);
    } catch (error) {
      console.error(error);
    }
  };
  