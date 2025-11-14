export const formatAmount = (value: string) => {
  const num = parseFloat(value);
  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "NGN",
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
