import { Navigate, useRouteLoaderData } from "react-router-dom";
import { AUTH_LOADER_ID } from "../routes/auth.layout";
import type { UserProfile } from "../features/account/types";
import { Box, CircularProgress } from "@mui/material";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const profile = useRouteLoaderData(AUTH_LOADER_ID) as UserProfile;

  if (profile === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const role = profile?.role;
  const isStaff = role === "ADMIN" || role === "MODERATOR";

  return isStaff ? children : <Navigate to="/" replace />;
}
