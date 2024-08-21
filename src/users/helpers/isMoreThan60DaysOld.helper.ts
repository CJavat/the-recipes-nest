export const isMoreThan30DaysOld = (userInactiveDate: Date) => {
  const today = new Date();

  const diffTime = +today - +userInactiveDate;

  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays > 90;
};
