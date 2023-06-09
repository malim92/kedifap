import axios from "axios";

export const FetchOffer = async (offerId) => {
  const url = new URL(`${process.env.REACT_APP_API_URL}/fetch-offer?offer_id=${offerId}`);
  console.log(url, "url offer");

  try {
    const response = await axios.get(url);
    console.log(response, "response fetch-offer");
    return response
  } catch (error) {
    console.error(error);
  }
};
