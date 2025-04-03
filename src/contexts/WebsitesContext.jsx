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
    Timestamp,
    writeBatch
} from "firebase/firestore";

const WebsitesContext = createContext();

const WebsitesProvider = ({ children }) => {
    // Main websites state
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

    // Favorites with localStorage persistence
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

    // Persist favorites to localStorage
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

    // Load more websites (pagination)
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

    // Load trending websites (realtime updates)
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

    // Load latest websites (realtime updates)
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

    // Unload tab-specific data when switching tabs
    const unloadTabData = useCallback((tab) => {
        if (tab === "trending") {
            setTrendingWebsites([]);
            setTrendingLoaded(false);
        } else if (tab === "latest") {
            setLatestWebsites([]);
            setLatestLoaded(false);
        }
    }, []);

    const updateAllTitles = async () => {
        const snapshot = await getDocs(collection(db, "websites"));
        const batch = writeBatch(db);
        
        snapshot.forEach(doc => {
            batch.update(doc.ref, {
                titleLowercase: doc.data().title.toLowerCase()
            });
        });
        
        await batch.commit();
    };

    // Initial data load
    useEffect(() => {
        loadInitialWebsites();
        updateAllTitles()
    }, [loadInitialWebsites]);

    // Update visit count both locally and in Firestore
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

    // Enhanced search functionality
    const searchAllWebsites = useCallback(async (searchTerm) => {
        const term = searchTerm.trim().toLowerCase(); // Convert search to lowercase
        if (term.length < 2) return [];
    
        try {
            const websitesRef = collection(db, "websites");
            const snapshot = await getDocs(websitesRef);
            
            return snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(website => {
                    // Case-insensitive tag matching
                    const tagMatch = website.tags?.some(tag => 
                        tag.toLowerCase().includes(term)
                    );
                    
                    // Case-insensitive title matching
                    const titleMatch = website.title.toLowerCase().includes(term);
                    
                    return tagMatch || titleMatch;
                })
                .sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0));
        } catch (error) {
            console.error("Search error:", error);
            return [];
        }
    }, []);
    // Memoized context value
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
        unloadTabData,
        searchAllWebsites
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
        unloadTabData,
        searchAllWebsites
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