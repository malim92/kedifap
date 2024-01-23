function CalculateMixTotal(mixProgress, setMixProgress, product, updatedItems) {
  console.log(updatedItems, "updatedItems in CalculateMixTotal");
  console.log(mixProgress, "mixProgress in CalculateMixTotal");

  if (product.DEXT_OFFERCODE !== "4") return;

  if (mixProgress[product.OFFERID] && mixProgress[product.OFFERID]['progress'] > 100) {
    console.log(mixProgress, "mixProgress > 100 ");
    setMixProgress({ ...mixProgress,[product.OFFERID]: {progress: 100} });
  } else {
    console.log(mixProgress, "mixProgress in else ");
    const quantity = parseInt(product.quantity) || 0;

    // setMixProgress(prevMixProgress => ({
    //   ...prevMixProgress,
    //   [product.OFFERID]: (prevMixProgress[product.OFFERID] || 0) + (quantity * 100 / product.OFFERQTY),
    // }));

    setMixProgress(prevMixProgress => {
      const currentProgress = prevMixProgress[product.OFFERID]?.progress || 0;
      const currentQuantuity = prevMixProgress[product.OFFERID]?.quantity || 0;
      console.log(currentQuantuity, "currentProgress in else ");
    
      return {
        ...prevMixProgress,
        [product.OFFERID]: {
          progress: currentProgress + (parseInt(quantity) * 100 / product.OFFERQTY),
          quantity: currentQuantuity !== undefined ? currentQuantuity + parseInt(quantity) : parseInt(quantity),
        },
      };
    });
    

    

  }
  console.log(mixProgress, "mixProgress in final ");

}

export default CalculateMixTotal;