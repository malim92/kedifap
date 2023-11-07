import axios from "axios";
import moment from "moment";

export const FetchInvoiceData = async (
  sorting,
  globalFilter,
  columnFilters,
  // pagination,
  setData,
  setRowCount,
  setIsError,
  monthFilter
) => {
  let userId = localStorage.getItem('userId').split('-')[0];
  const url = new URL(
    `${process.env.REACT_APP_API_URL}/invoices?customer_id=${userId}`
  );
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]

  console.log(url, "url invoices");
  console.log(monthFilter, "url monthFilter");

  //call Api
  if (monthFilter) {
    url.searchParams.set(
      "monthFilter",
      JSON.stringify([{ id: "monthFilter", value: monthFilter }])
    );
  }

  let InvoiceData = {};
  let InvoiceDataC = {};

  try {
    const response = await axios.get(url);
    console.log(response, "response invoices");

    InvoiceData = response.data.value.map((item) => ({
      ...item,
      IVDATE: moment(item.IVDATE).format("DD-MM-YYYY"),
    }));
  } catch (error) {
    console.error(error);
  }

  const urlInvoiceC = new URL(
    `${process.env.REACT_APP_API_URL}/invoices-c?customer_id=${userId}`
  );

  console.log(urlInvoiceC, "urlInvoiceC invoices");
  urlInvoiceC.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]

  if (monthFilter) {
    urlInvoiceC.searchParams.set(
      "monthFilter",
      JSON.stringify([{ id: "monthFilter", value: monthFilter }])
    );
  }
  try {
    const responseC = await axios.get(urlInvoiceC);
    console.log(responseC, "response InvoiceC");

    InvoiceDataC = responseC.data.value.map((item) => ({
      ...item,
      IVDATE: moment(item.IVDATE).format("DD-MM-YYYY"),
    }));
  } catch (error) {
    console.error(error);
  }

  let totalInvoices = [...InvoiceData, ...InvoiceDataC];
  setData(totalInvoices);
  setRowCount(InvoiceData.length);
};
