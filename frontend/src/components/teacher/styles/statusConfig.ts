import { ApplicationStatus } from "../../types";

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { color: string; icon: string; label: string }
> = {
  SUBMITTED: {
    color: "#3498DB",
    icon: "paper-plane-outline",
    label: "Submitted",
  },
  UNDER_REVIEW: {
    color: "#F39C12",
    icon: "eye-outline",
    label: "Under Review",
  },
  SHORTLISTED: { color: "#8E44AD", icon: "star-outline", label: "Shortlisted" },
  INTERVIEW_REQUESTED: {
    color: "#1ABC9C",
    icon: "calendar-outline",
    label: "Interview Requested",
  },
  REJECTED: {
    color: "#E74C3C",
    icon: "close-circle-outline",
    label: "Rejected",
  },
  HIRED: {
    color: "#27AE60",
    icon: "checkmark-circle-outline",
    label: "Hired 🎉",
  },
};

export default STATUS_CONFIG;
