import React, { useState } from "react";
import style from "./Navbar.module.scss";
import MobileNav from "../MobileNav/MobileNav";
import { AnimatePresence } from "framer-motion";


interface NavbarProps {
  handleNavigate: (route: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <MobileNav
            handleClose={() => setIsMenuOpen(false)}
            handleNavigate={(route) => {
              setIsMenuOpen(false);
              handleNavigate(route);
            }}
          />
        )}
      </AnimatePresence>
      <div className={style.fullNav}>
        <div className={style.mobileToggle} onClick={() => setIsMenuOpen(true)}>
          <p>Menu</p>
        </div>
        <div className={style.fullNavL}>
          <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/portfolio")}>Home</p>
          </div>
          <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/theory")}>Theory</p>
          </div>
          {/* <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/companies")}>Companies</p>
          </div> */}
        </div>
        <div className={style.fullNavC}>
          <p>else</p>
        </div>
        <div className={style.fullNavR}>
          <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/perspectives")}>Perspective</p>
          </div>
          <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/team/teamMember")}>Team</p>
          </div>
          <div className={style.topNavItem}>
            <p onClick={() => handleNavigate("/contact")}>Contact</p>
          </div>
        </div>
      </div>
    </>

  );
};

export default Navbar;
