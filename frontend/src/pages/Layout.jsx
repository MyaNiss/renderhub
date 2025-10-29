import React from 'react';
import {Outlet} from "react-router";
import FloatingBanner from "../components/FloatingBanner.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const Layout = () => {
    return (
        <div className="Container site-wrap">
            <header>
                <Header/>
            </header>
            <div>
                <FloatingBanner/>
            </div>
            <section className={"content-wrap"}>
                <Outlet/>
            </section>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default Layout;