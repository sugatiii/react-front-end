import React, { useState } from "react";
// import { Link } from "react-router-dom";
import "./navbar.css";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Auth from "../../hooks/auth";

function Navbar() {
  const { logOut, user } = Auth();
  const [Menu, setMenu] = useState(false);
  const handleMenu = () => {
    setMenu(!Menu);
  };

  const logOutUser = () => {
    logOut();
  };

  return (
    <div>
      <div className="header-nav">
        <h1 className="logo">
          STUDENT
          <span className="logo2"> SCHOLL</span>
        </h1>
        <ul className="top-nav">
          <li className="linkHeader">
            {/* <Link className="linkHeader no-underline" to="/home"> */}
            HOME
            {/* </Link> */}
          </li>
          <li className="linkHeader">
            {/* <Link className="linkHeader no-underline" to="/student"> */}
            STUDENT
            {/* </Link> */}
          </li>
          <li className="linkHeader">ABOUT</li>
        </ul>
        <div className="profile">
          <div className="dropdown-new">
            <img
              src="./img/Raisa.jpg"
              width={100}
              height={100}
              className="size-img-nav m-5"
              alt="Avatar"
            />

            <div className="dropdown-content-new">
              <p className="cursor-pointer" onClick={logOutUser}>
                Log Out
              </p>
            </div>
          </div>
        </div>
        <div className="items-center md:hidden">
          {Menu ? (
            <AiOutlineClose size={20} onClick={handleMenu} />
          ) : (
            <AiOutlineMenu size={20} onClick={handleMenu} />
          )}
        </div>
        <div className={Menu ? "left-nav z-50" : "left-nav1 z-50"}>
          <div className="nav-select">
            <img
              src="./img/Raisa.jpg"
              width={100}
              height={100}
              // style={{ width: "100px", height: "100px", objectFit: "cover" }}
              className="size-img cursor-pointer m-5"
              alt="Avatar"
            />
            <div>
              <p>{user.name}</p>
            </div>
          </div>
          <ul className="space-left-nav">
            <li className="navbar-left">Home</li>
            <li className="navbar-left">About</li>
            <li className="navbar-left">
              <p className="cursor-pointer" onClick={logOutUser}>
                Log Out
              </p>
            </li>
            {/* <li className="navbar-left">STORIES</li>
              <li className="navbar-left">ANIME</li>
              <li className="navbar-left">DONGHUA</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
