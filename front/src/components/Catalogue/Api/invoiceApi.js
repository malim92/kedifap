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
  monthFilter,
  setIsLoading
) => {
  setIsLoading(true);
  let userId = localStorage.getItem("userId");
  const url = new URL(
    `${process.env.REACT_APP_API_URL}/invoices?customer_id=${userId}`
  );
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); //[{"id":"PARTNAME","value":"sa"}]

  console.log(url, "url invoices");

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

  if (typeof sorting !== 'undefined' && sorting.length > 0) {
    totalInvoices = sorting[0]["desc"]
      ? totalInvoices.sort((a, b) =>
          moment(b.IVDATE, "DD-MM-YYYY").diff(moment(a.IVDATE, "DD-MM-YYYY"))
        )
      : totalInvoices.sort((a, b) =>
          moment(a.IVDATE, "DD-MM-YYYY").diff(moment(b.IVDATE, "DD-MM-YYYY"))
        );
  }
  console.log(totalInvoices, "url sortedTotalInvoices");
  setData(totalInvoices);
  setRowCount(InvoiceData.length);
  setIsLoading(false);
};
