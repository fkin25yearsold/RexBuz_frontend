import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    email: "",
    phone: "",
    fullName: "",
    role: "",
  });

  const updateUserData = (data) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const clearUserData = () => {
    setUserData({
      email: "",
      phone: "",
      fullName: "",
      role: "",
    });
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");

    // Handle edge cases for short usernames
    if (username.length <= 1) {
      return `${username}***@${domain}`;
    } else if (username.length === 2) {
      return `${username.charAt(0)}*@${domain}`;
    } else {
      // Normal case: first char + asterisks + last char
      const maskedUsername =
        username.charAt(0) +
        "*".repeat(username.length - 2) +
        username.charAt(username.length - 1);
      return `${maskedUsername}@${domain}`;
    }
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    // Remove +91 prefix for masking
    const cleanPhone = phone.replace(/^\+91/, "");

    // Handle edge cases for short phone numbers
    if (cleanPhone.length <= 4) {
      return `+91${cleanPhone.substring(0, 1)}***${cleanPhone.substring(cleanPhone.length - 1)}`;
    } else {
      // Normal case: first 2 digits + asterisks + last 2 digits
      const repeatCount = Math.max(0, cleanPhone.length - 4);
      const masked =
        cleanPhone.substring(0, 2) +
        "*".repeat(repeatCount) +
        cleanPhone.substring(cleanPhone.length - 2);
      return `+91${masked}`;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        clearUserData,
        maskEmail,
        maskPhone,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
