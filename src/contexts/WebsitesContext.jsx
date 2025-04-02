import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { db } from "../firebaseConfig";
import {
    collection,
    query,
    orderBy,
    doc,
    increment,
    updateDoc,
    onSnapshot,
    getDocs
} from "firebase/firestore";

const WebsitesContext = createContext();

const WebsitesProvider = ({ children }) => {
    
    
    const [activeTab, setActiveTab] = useState("all");
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('websiteFavorites');
                return saved ? JSON.parse(saved) : [];
            }
            return [];
        } catch (e) {
            console.error("Error reading favorites:", e);
            return [];
        }
    });

    // Persist favorites
    useEffect(() => {
        try {
            localStorage.setItem('websiteFavorites', JSON.stringify(favorites));
        } catch (e) {
            console.error("Error saving favorites:", e);
        }
    }, [favorites]);

    const toggleFavorite = useCallback((websiteId) => {
        setFavorites(prev =>
            prev.includes(websiteId)
                ? prev.filter(id => id !== websiteId)
                : [...prev, websiteId]
        );
    }, []);

    // Fetch websites
    useEffect(() => {
        const websitesRef = collection(db, "websites");
        const websitesQuery = query(websitesRef, orderBy("title"));

        const unsubscribe = onSnapshot(
            websitesQuery,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setWebsites(data);
                setLoading(false);
            },
            (error) => {
                console.error("Firestore error:", error);
                setError("Failed to load websites");
                setLoading(false);
            }
        );

        // Initial load from cache
        getDocs(websitesQuery, { source: 'cache' })
            .then(cachedSnapshot => {
                if (!cachedSnapshot.empty) {
                    const cachedData = cachedSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setWebsites(cachedData);
                }
            })
            .catch(() => { }); // Ignore cache errors

        return () => unsubscribe();
    }, []);

    const updateVisitCount = useCallback(async (websiteId) => {
        try {
            setWebsites(prev => prev.map(website =>
                website.id === websiteId
                    ? { ...website, visitedCount: (website.visitedCount || 0) + 1 }
                    : website
            ));

            await updateDoc(doc(db, 'websites', websiteId), {
                visitedCount: increment(1)
            });
        } catch (error) {
            console.error("Update error:", error);
            setError("Failed to update visit count");
        }
    }, []);

    const getTodaysWebsites = useCallback((websites) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return websites.filter(website => {
            if (!website.createdAt) return false;
            const websiteDate = website.createdAt.toDate();
            websiteDate.setHours(0, 0, 0, 0);
            return websiteDate.getTime() === today.getTime();
        });
    }, []);

    const value = useMemo(() => ({
        activeTab,
        setActiveTab,
        websites,
        loading,
        error,
        updateVisitCount,
        favorites,
        toggleFavorite,
        getTodaysWebsites 
    }), [activeTab, websites, loading, error, updateVisitCount, favorites, toggleFavorite]);

    return (
        <WebsitesContext.Provider value={value}>
            {children}
        </WebsitesContext.Provider>
    );
};

const useWebsites = () => {
    const context = useContext(WebsitesContext);
    if (!context) {
        throw new Error('useWebsites must be used within a WebsitesProvider');
    }
    return context;
};

export { WebsitesProvider, useWebsites };