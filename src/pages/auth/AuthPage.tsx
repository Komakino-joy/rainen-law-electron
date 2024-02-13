"use client";

import React from "react";
import LoginForm from "@/components/Forms/LoginForm/LoginForm";
import { useIsConnectedToDB } from "~/context/DatabaseContext";
import "./AuthPage.scss";
import DatabaseForm from "~/components/Forms/DatabaseForm/DatabaseForm";

const AuthPage = () => {
  const isConnectedToDB = useIsConnectedToDB();

  return (
    <div className="page-wrapper">
      <div className="light-border form-container">
        {isConnectedToDB ? (
          <>
            <h1>Rainen Law</h1>
            <LoginForm />
          </>
        ) : (
          <>
            <h3>Connect to database</h3>
            <DatabaseForm />
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
