import axios from "axios";
import moment from "moment";

export const FetchInvoiceData = async (
    sorting,
    globalFilter,
    columnFilters,
    // pagination,
    setData,
    setRowCount,
    setIsError
  ) => {
    
    let userId = localStorage.getItem('userId');
    const url = new URL(
      `${process.env.REACT_APP_API_URL}/invoices?customer_id=${userId}`
    );
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]

    console.log(url, "url invoices");
  
    try {
      const response = await axios.get(url);
    console.log(response, "response invoices");

    const InvoiceData = response.data.value.map((item) => ({
      ...item,
      IVDATE: moment(item.IVDATE).format(
        "DD-MM-YYYY"
      ),
    }));

      setData(InvoiceData);
      setRowCount(InvoiceData.length);
    } catch (error) {
      console.error(error);
    }
  };
  