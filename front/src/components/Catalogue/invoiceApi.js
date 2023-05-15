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
      `https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/AINVOICES?$filter=CUSTNAME eq '${userId}' and STATDES eq 'Final'`);
      console.log(url, "url invoiceData 1");

    try {
      const response = await axios.get(url, {
        auth: {
          username: "apiuser",
          password: "1234",
        },
      });
      
      console.log(response.data.value, "response.data.value invoiceData 1");

      const invoiceData = response.data.value.map((item) => ({
        ...item,
        IVDATE: moment(item.IVDATE).format("DD-MM-YYYY"),
      }));
  
      console.log(invoiceData, "invoiceData 1");
  
      setData(invoiceData);
      console.log(invoiceData, "invoiceData 2");
      setRowCount(invoiceData.length);
    } catch (error) {
      console.error(error);
    }
  };
  