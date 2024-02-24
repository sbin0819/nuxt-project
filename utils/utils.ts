export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month.toString().padStart(2, '0')}/${day
    .toString()
    .padStart(2, '0')}`;
};

export const timeToRead = (size: number) => {
  return Math.ceil(size / 250);
};
