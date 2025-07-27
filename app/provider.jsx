"use client";
import React, { Suspense, useEffect, useState } from "react";
import Header from "./_components/Header";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContex } from "./_context/UserDetailContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    if (user) {
      // Set user details in localStorage for dashboard
      localStorage.setItem(
        "userEmail",
        user?.primaryEmailAddress?.emailAddress || ""
      );
      localStorage.setItem("userName", user?.fullName || "");
      CheckUserAuth();
    }
  }, [user]);

  //Save user data
  const CheckUserAuth = async () => {
    //Save User to Database
    const result = await axios.post("/api/users", {
      userName: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    setUserDetail(result.data);
  };

  return (
    <Suspense>
      <div>
        <UserDetailContex.Provider value={{ userDetail, setUserDetail }}>
          <Header />
          <div>{children}</div>
        </UserDetailContex.Provider>
      </div>
    </Suspense>
  );
}

export default Provider;
