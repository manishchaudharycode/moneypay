"use client"

import axios from "axios";
import { useEffect, useState } from "react";


type Request = {
  email: string;
  password: string;
  name?: string;
};

export const loginApi = async (payload: Request) => {
  const response = await axios.post(
    "http://localhost:4000/api/v1/user/signin",
    payload
  );

  localStorage.setItem("token", response.data.token)
  return response.data;
  
};

export const signUpApi = async (payload: Request) => {
  const response = await axios.post(
    "http://localhost:4000/api/v1/user/signup",
    payload
  );
     if (response.data.token) {

        localStorage.setItem("token", response.data.token);

      }

};