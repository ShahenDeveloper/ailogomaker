"use client";
import React, { useEffect, useContext } from "react";
import Info from "./_components/Info";
import LogoList from "./_components/LogoList";
import { useSearchParams } from "next/navigation";
import { UserDetailContex } from "../_context/UserDetailContext";
import axios from "axios";

function Dashboard() {
  const searchParams = useSearchParams();
  const { setUserDetail } = useContext(UserDetailContex);

  useEffect(() => {
    const refreshUser = async () => {
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      if (userEmail) {
        const result = await axios.post("/api/users", { userEmail, userName });
        setUserDetail(result.data);
      }
    };

    refreshUser();

    if (searchParams.get("success")) {
      refreshUser();
    }
  }, [searchParams, setUserDetail]);

  return (
    <div className="mt-20">
      <Info />
      <LogoList />
    </div>
  );
}

export default Dashboard;
