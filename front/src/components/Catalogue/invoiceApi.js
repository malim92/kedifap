import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";

export const FetchInvoiceData = async (
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
      `https://kedifap-portal.com2go.co/invoices`
    );
    console.log(url, "url invoices");
  
    try {
      const response = await axios.get(url);
    console.log(response, "response invoices");

      setData(response.data.value);
      setRowCount(response.data.value.length);
    } catch (error) {
      console.error(error);
    }
  };
  