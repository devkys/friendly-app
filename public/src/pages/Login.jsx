import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/handshaking.svg';
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
    const navigate = useNavigate();
    const toastOptions = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    };

    useEffect(() => {
        if(localStorage.getItem("friendly-app")) {
            navigate("/");
        }
    }, [navigate]);

    const [values, setValue] = useState({
        choice: "",
        username: "",
        email: "",
        password: ""
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
        const { username, password } = values;
        const { data } = await axios.post(loginRoute, {
            username,       
            password,
        });
        if( data.status === false) {
            toast.error(data.msg, toastOptions);
        }
        if( data.status === true) {
            localStorage.setItem("friendly-app", JSON.stringify(data.user));
            navigate("/");
        }
    }
  };
  const handleChange = (event) => {
    setValue({...values, [event.target.name]: event.target.value});
  };

  const handleValidation = () => {
    const { username, password } = values;

    if(username.length === "") {
        toast.error('아이디를 입력하세요.', toastOptions);
        return false;
    }
    
    else if(password.length === "" ) {
        toast.error('비밀번호를 입력하세요.', toastOptions);
        return false;
    }
    // alert("로그인 성공");
    return true;
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="logo" />
                <h1>wave</h1>
            </div>
            
            <input 
            type="text"
            placeholder="Enter username"
            name="username"
            min="3"
            onChange={(e) => handleChange(e)}
             />          
             <input 
             type="password"
             placeholder="Input password"
             name="password"
             onChange={(e) => handleChange(e)}
             />       
             <button type="submit">Log in</button>
             <span>
                Don't have any account?
                <Link to='/register'> Create one here</Link>
             </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: aliceblue;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
        height: 5rem;
    }
    h1 {
        text-transform: uppercase;
        font-size: 3rem;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  select { 
    width: 400px;
    text-align:center;
  }
  input, select {
    padding: 0.5rem;
    width: 100%;
   font-size: 1rem;
   &:focus {
    outline: none;
    border: 0.2rem solid #9cbdec;
   }
  }
  button {
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius:0.2rem;
    background-color: #b5b4b4;
    font-weight: bold;
    font-size:1rem;
    text-transform: uppercase;
    cursor: pointer;
    &:hover {
        background-color: #add2e0;
    }
  }

  span {
    text-transform: uppercase;
    a {
        text-decoration: none;
    }
  }


`;
