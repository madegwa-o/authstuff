
import Header from "./components/header/header.tsx";
import Sidebar from "./components/sidebar/sidebar.tsx";
import {useState} from "react";
import styles from './BaseLayout.module.css'
import {Outlet} from "react-router-dom";

function BaseLayout() {
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <>
            <Header />
            <div className={styles.layout}>
                {isSidebarVisible && (
                    <div className={styles.sidebarContainer}>
                        <Sidebar />
                        <button
                            className={styles.toggleButton}
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            close
                        </button>
                    </div>
                )}
                {!isSidebarVisible && (
                    <button
                        className={`${styles.toggleButton} ${styles.toggleButtonClosed}`}
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        open
                    </button>
                )}
                <main className={styles.content}>
                    <Outlet/>
                </main>
            </div>
        </>
    );
}



export default BaseLayout;