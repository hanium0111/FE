import React from "react";
import { Box, Skeleton } from "@mui/material";

const SkeletonUI = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Skeleton variant="circular" width={70} height={70} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Skeleton variant="text" width="80%" height={40} />
        <Skeleton
          variant="rectangular"
          width="80%"
          height={200}
          sx={{ mt: 2 }}
        />
        <Skeleton variant="text" width="80%" height={40} sx={{ mt: 2 }} />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Box sx={{ display: "flex", mt: 2 }}>
          <Skeleton
            variant="rectangular"
            width={60}
            height={30}
            sx={{ mr: 2 }}
          />
          <Skeleton variant="rectangular" width={60} height={30} />
        </Box>
      </Box>

      {/* 네모칸 6줄 스켈레톤 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mt: 2,
        }}
      >
        {Array.from(new Array(6)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={150}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SkeletonUI;
