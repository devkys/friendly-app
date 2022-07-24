import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/handshaking.svg';
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
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
      if(localStorage.getItem("friendly-app")){
        navigate("/");
      }
    },[navigate]);

    const [values, setValue] = useState({
        choice: "",
        username: "",
        email: "",
        password: ""
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
        const { choice, username, email, password } = values;
        const { data } = await axios.post(registerRoute, {
            choice,
            username,
            email,
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
    const { username,  email, password, confirmPassword } = values;
    if( password !== confirmPassword ) {
        toast.error('비밀번호가 맞지 않습니다.', toastOptions);
        return false;
    }
    else if(username.length < 3) {
        toast.error('아이디 3자리 이상이 필요합니다.', toastOptions);
        return false;
    }
    else if(email === '') {
        toast.error('이메일을 입력해주세요', toastOptions);
        return false;
    }
    else if(password.length < 8 ) {
        toast.error('비밀번호 8자리 이상이 필요합니다.', toastOptions);
        return false;
    }
    // alert("회원가입 성공");
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
            <select defaultValue="default" name="choice" onChange={(e) => handleChange(e)}>
                <option value="default" disabled hidden>=====선택=====</option>
                <option key="aespa" value="aespa">에스파</option>
                <option key="txt" value="txt">투마로우바이투게더</option>
                <option key="redvelvet" value="redvelvet">레드벨벳</option>
                <option key="idle" value="idle">(여자)아이들</option>
                <option key="stayc" value="stayc">스테이씨</option>
                <option key="nct-dream" value="nct-dream">엔시티 드림</option>
            </select>
            <input 
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={(e) => handleChange(e)}
             />
             <input 
             type="email"
             placeholder="Enter your email"
             name="email"
             onChange={(e) => handleChange(e)}
             />
             <input 
             type="password"
             placeholder="Input password"
             name="password"
             onChange={(e) => handleChange(e)}
             />
             <input type="password"
             placeholder="Confirm Password"
             name="confirmPassword"
             onChange={(e) => handleChange(e)}
             />
             <button type="submit">create</button>
             <span>
                Already have an account ?
                <Link to='/login'> log in</Link>
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
   font-size: 1.5rem;
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
