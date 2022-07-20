import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  useEffect(() => {
    if(!localStorage.getItem("friendly-app")) {
        navigate("/login");
    }
}, [navigate]);

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined) {
        toast.error('프로필 사진을 선택하세요', toastOptions);
    }
    else {
        const user = await JSON.parse(localStorage.getItem("friendly-app"));
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
        });
        if(data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("friendly-app", JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("이미지 세팅 오류, 다시 시도하세요.", toastOptions);
        }
    }
  };
  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);
  return (
    <>
    {
        isLoading? <Container>
            <img src={loader} alt="loader" className="loader"/>
        </Container> : (
      <Container>
        <div className="title-container">
          <h1>프로필 사진을 선택하세요.</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            );
          })}
        </div>
        <button className="btn" onClick={setProfilePicture}>프로필 사진 생성</button>
      </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: aliceblue;
    height: 100vh;
    width: 100vw;
    .loader {
        max-inline-size: 100%;
    }
    .title-container {
        h1 {
            color: gray;
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.1rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.3s ease-in-out;
            img {
                height: 6rem;
                transition: 0.5s ease-in-out;
            }
        }
        .selected {
            border: 0.4rem solid #8bcaef;
            border-radius: 3rem;
        }
    }
    .btn {
        background-color: #add2e0;        
        color: gray;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        font-size: 1rem;
        border-radius: 1rem;
        &:hover {
            background-color: #8bcaef;
            border-radius: 2rem;
            transition: 0.3s ease-in-out;
            
        }
    }
    

`;
