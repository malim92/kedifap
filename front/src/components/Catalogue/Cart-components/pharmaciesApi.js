import axios from "axios";

export const FetchPharmacies = async () => {
  const url = new URL(`${process.env.REACT_APP_API_URL}/pharmacies`);
  console.log(url, "url pharmacies");

  try {
    const response = await axios.get(url);

    const modifiedPharmaciesList = response.data.value
  .reduce((acc, { FIRM, CUSTNAME }) => {
    const existingItem = acc.find(item => item.Code === CUSTNAME);
    if (!existingItem) {
      acc.push({ label: FIRM, Code: CUSTNAME });
    }
    return acc;
  }, []);

    return modifiedPharmaciesList;
  } catch (error) {
    console.error(error);
  }
};
