export const taskStatuses = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const taskPriorities = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

export function getNextStatus(status) {
  if (status === "pending") {
    return "in-progress";
  }

  if (status === "in-progress") {
    return "completed";
  }

  return "pending";
}
