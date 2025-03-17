export const formatCurrency = (x) => {
    try {
      return x.toLocaleString("it-IT", { style: "currency", currency: "VND" });
    } catch (error) {
      console.log(error);
      return `0 VND`;
    }
  };