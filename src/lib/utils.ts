export const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "badge-success";
    case "POST":
      return "badge-primary";
    case "PUT":
      return "badge-warning";
    case "DELETE":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};
