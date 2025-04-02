import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { db } from "../firebaseConfig";
import {
    collection,
    query,
    orderBy,
    doc,
    increment,
    updateDoc,
    limit,
    startAfter,
    getDocs,
    onSnapshot,
    where,
    Timestamp
} from "firebase/firestore";

const WebsitesContext = createContext();

const WebsitesProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [noMoreData, setNoMoreData] = useState(false);
    
    // Trending websites state
    const [trendingWebsites, setTrendingWebsites] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(false);
    const [trendingLoaded, setTrendingLoaded] = useState(false);

    // Latest websites state
    const [latestWebsites, setLatestWebsites] = useState([]);
    const [latestLoading, setLatestLoading] = useState(false);
    const [latestLoaded, setLatestLoaded] = useState(false);

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

    // Load initial websites
    const loadInitialWebsites = useCallback(async () => {
        try {
            setLoading(true);
            const websitesRef = collection(db, "websites");
            const websitesQuery = query(
                websitesRef,
                orderBy("title"),
                limit(15)
            );

            const documentSnapshots = await getDocs(websitesQuery);
            
            if (documentSnapshots.empty) {
                setNoMoreData(true);
                return;
            }

            const newWebsites = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setWebsites(newWebsites);
            setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            setNoMoreData(newWebsites.length < 15);
        } catch (error) {
            console.error("Firestore error:", error);
            setError("Failed to load websites");
        } finally {
            setLoading(false);
        }
    }, []);

    // Load more websites
    const loadMoreWebsites = useCallback(async () => {
        if (!lastVisible || loadingMore || noMoreData) return;
        
        try {
            setLoadingMore(true);
            const websitesRef = collection(db, "websites");
            const websitesQuery = query(
                websitesRef,
                orderBy("title"),
                startAfter(lastVisible),
                limit(15)
            );

            const documentSnapshots = await getDocs(websitesQuery);
            
            if (documentSnapshots.empty) {
                setNoMoreData(true);
                return;
            }

            const newWebsites = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setWebsites(prev => [...prev, ...newWebsites]);
            setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            setNoMoreData(newWebsites.length < 15);
        } catch (error) {
            console.error("Firestore error:", error);
            setError("Failed to load more websites");
        } finally {
            setLoadingMore(false);
        }
    }, [lastVisible, loadingMore, noMoreData]);

    // Load trending websites
    const loadTrendingWebsites = useCallback(async () => {
        if (trendingLoaded) return;
        
        try {
            setTrendingLoading(true);
            const q = query(
                collection(db, "websites"),
                orderBy("visitedCount", "desc"),
                limit(10)
            );
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTrendingWebsites(data);
                setTrendingLoading(false);
                setTrendingLoaded(true);
            });
            
            return unsubscribe;
        } catch (error) {
            console.error("Error loading trending:", error);
            setTrendingLoading(false);
        }
    }, [trendingLoaded]);

    // Load latest websites
    const loadLatestWebsites = useCallback(async () => {
        if (latestLoaded) return;
        
        try {
            setLatestLoading(true);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const q = query(
                collection(db, "websites"),
                where("createdAt", ">=", Timestamp.fromDate(today)),
                orderBy("createdAt", "desc")
            );
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLatestWebsites(data);
                setLatestLoading(false);
                setLatestLoaded(true);
            });
            
            return unsubscribe;
        } catch (error) {
            console.error("Error loading latest:", error);
            setLatestLoading(false);
        }
    }, [latestLoaded]);

    // Unload data when switching away from tabs
    const unloadTabData = useCallback((tab) => {
        if (tab === "trending") {
            setTrendingWebsites([]);
            setTrendingLoaded(false);
        } else if (tab === "latest") {
            setLatestWebsites([]);
            setLatestLoaded(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadInitialWebsites();
    }, [loadInitialWebsites]);

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

    const value = useMemo(() => ({
        activeTab,
        setActiveTab,
        websites,
        loading,
        loadingMore,
        error,
        noMoreData,
        updateVisitCount,
        favorites,
        toggleFavorite,
        loadMoreWebsites,
        trendingWebsites,
        trendingLoading,
        loadTrendingWebsites,
        latestWebsites,
        latestLoading,
        loadLatestWebsites,
        unloadTabData
    }), [
        activeTab,
        websites,
        loading,
        loadingMore,
        error,
        noMoreData,
        updateVisitCount,
        favorites,
        toggleFavorite,
        loadMoreWebsites,
        trendingWebsites,
        trendingLoading,
        loadTrendingWebsites,
        latestWebsites,
        latestLoading,
        loadLatestWebsites,
        unloadTabData
    ]);

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