import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const WebsitesContext = createContext();

const WebsitesProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWebsites = async () => {
            setLoading(true);
            try {
                const firstQuery = query(
                    collection(db, "websites"),
                    orderBy("title")
                );

                const querySnapshot = await getDocs(firstQuery);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setWebsites(data);
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
            setLoading(false);
        };

        fetchWebsites();
    }, []);

    return (
        <WebsitesContext.Provider
            value={{
                activeTab,
                setActiveTab,
                websites,
                loading
            }}
        >
            {children}
        </WebsitesContext.Provider>
    );
};

const useWebsites = () => useContext(WebsitesContext);

export { WebsitesProvider, useWebsites };
