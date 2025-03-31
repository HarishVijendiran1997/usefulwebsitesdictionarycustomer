import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";

const WebsitesContext = createContext();

const WebsitesProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);

    const PAGE_LIMIT = 12;

    useEffect(() => {
        const fetchWebsites = async () => {
            setLoading(true);
            try {
                const firstQuery = query(
                    collection(db, "websites"),
                    orderBy("title"),
                    limit(PAGE_LIMIT)
                );

                const querySnapshot = await getDocs(firstQuery);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setWebsites(data);
                setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
                setNoMoreData(querySnapshot.docs.length < PAGE_LIMIT); // No more data if less than 12 docs
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
            setLoading(false);
        };

        fetchWebsites();
    }, []);

    const loadMoreWebsites = async () => {
        if (!lastDoc || noMoreData) return;

        setLoading(true);
        try {
            const nextQuery = query(
                collection(db, "websites"),
                orderBy("title"),
                startAfter(lastDoc),
                limit(PAGE_LIMIT)
            );

            const querySnapshot = await getDocs(nextQuery);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setWebsites(prev => [...prev, ...data]);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setNoMoreData(querySnapshot.docs.length < PAGE_LIMIT);
        } catch (error) {
            console.error("Error fetching more websites:", error);
        }
        setLoading(false);
    };

    return (
        <WebsitesContext.Provider
            value={{
                activeTab,
                setActiveTab,
                websites,
                loading,
                noMoreData,
                loadMoreWebsites,
            }}
        >
            {children}
        </WebsitesContext.Provider>
    );
};

const useWebsites = () => useContext(WebsitesContext);

export { WebsitesProvider, useWebsites };
