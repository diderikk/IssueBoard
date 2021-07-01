export const formattedDueDate = (dueDate: string) => {
  const date = new Date(dueDate);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Des",
  ];

  const currentDate = new Date();
  if (date.getFullYear() !== currentDate.getFullYear())
    return `${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  else if (dueDate === null) return "None";
  else return `${monthNames[date.getMonth()]} ${date.getDate()}`;
};
