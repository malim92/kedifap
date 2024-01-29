import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment";


const sendOrder = async (
    order,
    isVendorName,
    freeQuantity,
    pharmacyValue,
    custNote,
    setShowCart,
    setCartItems,
    setTotal,
    setProductQuantity,
    setHighlightStyle,
    setCustNote
  ) => {
    const loadingToast = toast.loading("Sending order...");
    let userFullId = localStorage.getItem("userId");
    let [userId, dCode] = userFullId.split("-");
    let userDesc = localStorage.getItem("userDesc");
    console.log(isVendorName, "isVendorName in sendOrder.js");
    console.log(order, "order.()");
    if (order.length == 0) {
      toast.error("Cant send empty cart");
    }
    const productsinOrder = order.map((obj, index) => ({
      PARTNAME: obj.PARTNAME,
      // PDES: obj.PARTDES,
      TQUANT: parseInt(obj.quantity),
      DEXT_REQUESTEDQTY: parseInt(obj.quantity),
      DEXT_FREEQTY:
        freeQuantity[obj.PARTNAME] > 0 ? freeQuantity[obj.PARTNAME] : 0,
      PERCENT: 0,
      DEXT_CONFIRMORDER: index == order.length - 1 ? "Y" : "",
    }));

    console.log(pharmacyValue, "pharmacyValue");
    let today = moment().format();

    const orderObject = {
      CUSTNAME: isVendorName ? pharmacyValue.Code : userId,
      // CDES: userDesc,
      CURDATE: today,
      ...(isVendorName && { DEXT_SUPPNAME: isVendorName }),
      ...(isVendorName && { DEXT_SUPPDES: userDesc }),
      // DEXT_SUPPNAME: "V1239",
      // DEXT_SUPPDES: "4MORE LTD 2",
      DCODE: dCode,
      DEXT_CUSTOMERREMARKS: !isVendorName ? custNote : "",
      DEXT_VENTORREMARKS: isVendorName ? custNote : "",
      DEXT_SUBMISSIONDATE: today,
      PAYCODE: "20",
      DEXT_B2CONTACT: 9,
      B2B_ORDERITEMS_SUBFORM: productsinOrder,
    };

    setShowCart(false);

    //send order

    //const url = "http://localhost:8000/order";
    //const url = "https://kedifap-portal.com2go.co/order";
    const url = new URL(`${process.env.REACT_APP_API_URL}/order`);
    toast.dismiss(loadingToast);

    try {
      const response = await axios.post(url, orderObject);
      console.log(response, "response");
      toast.success("Order Sent Successfully, Thank you!!");
      setCartItems([]);
      setTotal(0);
      setProductQuantity({});
      setHighlightStyle([]);
      setCustNote("");
      localStorage.setItem("kediCart", []);
      localStorage.setItem("kediCartTotal", []);
      localStorage.setItem("kediCartDiscount", 0);
      localStorage.setItem("kediCartQuantity", 0);
      localStorage.setItem("kediCartFreeQuantity", []);
      localStorage.setItem("kediCartHighlight", []);
    } catch (error) {
      toast.error(
        "There was an issue making your order, please contact support."
      );
      console.error(error);
    }
  };

  export default sendOrder;