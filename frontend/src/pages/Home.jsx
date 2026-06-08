import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { isAuthenticated, getAuthHeader } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { hardcodedProducts, categories, dealsOfTheDay, trendingProducts } from '../data/products';
import './Home.css';

/* ── Hero banner slide data ───────────────────────────────── */
const heroSlides = [
    {
        badge: 'Limited Time Offer',
        title: 'Up to 60% off Electronics',
        subtitle: 'Discover incredible deals on top-rated headphones, speakers & smart devices.',
        cta: 'Shop Electronics',
        gradient: 'linear-gradient(135deg, #232f3e 0%, #37475a 40%, #1a5276 100%)',
    },
    {
        badge: 'New Arrivals',
        title: 'Latest in Tech Gadgets',
        subtitle: 'From flagship smartphones to pro laptops — gear up with the newest releases.',
        cta: 'Explore New Arrivals',
        gradient: 'linear-gradient(135deg, #0f3057 0%, #00587a 50%, #008891 100%)',
    },
    {
        badge: 'Deal of the Day',
        title: 'Smart Wearables Sale',
        subtitle: 'Smartwatches & earbuds at unbeatable prices. Free shipping on orders over ₹999.',
        cta: 'View Deals',
        gradient: 'linear-gradient(135deg, #1b1b2f 0%, #462255 50%, #7b2d8e 100%)',
    },
    {
        badge: 'Top Picks',
        title: 'Best Sellers under ₹10,000',
        subtitle: 'Keyboards, mice, power banks & more — top-rated products at every budget.',
        cta: 'Shop Best Sellers',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 40%, #1abc9c 100%)',
    },
];

/* ── Countdown helper (midnight target) ───────────────────── */
function getTimeLeft() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return {
        hours: String(hrs).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
    };
}

/* ================================================================
   HOME COMPONENT
   ================================================================ */
export default function Home({ searchQuery = '', searchCategory = 'All', onSearch }) {
    const [products, setProducts] = useState(hardcodedProducts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(getTimeLeft);
    const autoPlayRef = useRef(null);
    const navigate = useNavigate();

    /* ── Products are loaded from hardcoded data ─────────────── */
    /* (API fetch removed — hardcoded products use stable IDs    */
    /*  that match the ProductDetail page lookups)               */

    /* ── Countdown timer ─────────────────────────────────────── */
    useEffect(() => {
        const tid = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(tid);
    }, []);

    /* ── Hero auto-play ──────────────────────────────────────── */
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, []);

    useEffect(() => {
        autoPlayRef.current = setInterval(nextSlide, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide]);

    const goToSlide = (idx) => {
        setCurrentSlide(idx);
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(nextSlide, 5000);
    };

    /* ── Add to cart ─────────────────────────────────────────── */
    const handleAddToCart = async (productId) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        try {
            await axios.post(
                '/api/cart',
                { product_id: productId, quantity: 1 },
                { headers: getAuthHeader() },
            );
            alert('Product added to cart!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add to cart');
        }
    };

    /* ── Search / filter logic ───────────────────────────────── */
    const query = (searchQuery || '').trim().toLowerCase();
    const cat = searchCategory || 'All';

    const filteredProducts = products.filter((p) => {
        const matchesQuery = !query || p.name.toLowerCase().includes(query);
        const matchesCategory = cat === 'All' || p.category === cat;
        return matchesQuery && matchesCategory;
    });

    const isSearchActive = query.length > 0 || cat !== 'All';

    /* ── Render ──────────────────────────────────────────────── */
    return (
        <div className="home-page">
            {/* ====== HERO CAROUSEL ====== */}
            {!isSearchActive && (
                <section className="hero-carousel">
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {heroSlides.map((slide, i) => (
                            <div
                                key={i}
                                className="hero-slide"
                                style={{ background: slide.gradient }}
                            >
                                <div className="hero-slide-content">
                                    <span className="hero-slide-badge">{slide.badge}</span>
                                    <h1 className="hero-slide-title">{slide.title}</h1>
                                    <p className="hero-slide-subtitle">{slide.subtitle}</p>
                                    <span className="hero-slide-cta">{slide.cta}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-arrow carousel-arrow--prev" onClick={prevSlide} aria-label="Previous slide">
                        ‹
                    </button>
                    <button className="carousel-arrow carousel-arrow--next" onClick={nextSlide} aria-label="Next slide">
                        ›
                    </button>

                    <div className="carousel-dots">
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                className={`carousel-dot${i === currentSlide ? ' active' : ''}`}
                                onClick={() => goToSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Wrap the rest in the container */}
            <div className="container">
                {/* ====== CATEGORY CARDS ====== */}
                {!isSearchActive && (
                    <section className="home-section home-section--overlap fade-in-up">
                        <div className="section-header">
                            <h2>Shop by Category</h2>
                            <span className="section-link">See all categories</span>
                        </div>
                        <div className="category-scroll-row">
                            {categories.map((c) => (
                                <div key={c.name} className="category-card" onClick={() => {
                                    if (onSearch) {
                                        onSearch('', c.name);
                                    }
                                }}>
                                    <div className="category-icon" style={{ background: c.color, color: '#fff' }}>
                                        {c.icon}
                                    </div>
                                    <span className="category-name">{c.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ====== DEALS OF THE DAY ====== */}
                {!isSearchActive && dealsOfTheDay.length > 0 && (
                    <section className="home-section fade-in-up">
                        <div className="deals-banner">
                            <div className="deals-header">
                                <h2>
                                    <span className="deals-fire">🔥</span> Deals of the Day
                                </h2>
                                <div className="deals-timer">
                                    <span className="deals-timer-label">Ends in</span>
                                    <span className="timer-block">{timeLeft.hours}</span>
                                    <span className="timer-colon">:</span>
                                    <span className="timer-block">{timeLeft.minutes}</span>
                                    <span className="timer-colon">:</span>
                                    <span className="timer-block">{timeLeft.seconds}</span>
                                </div>
                            </div>
                            <div className="deals-scroll-row">
                                {dealsOfTheDay.map((product) => (
                                    <div key={product.id} className="deal-card-wrapper">
                                        <span className="deal-badge">
                                            {product.discount}% OFF
                                        </span>
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ====== SEARCH RESULTS INFO ====== */}
                {isSearchActive && (
                    <div className="search-results-info" style={{ marginTop: '1rem' }}>
                        <span>
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}{' '}
                            {query && <>for <strong>"{searchQuery}"</strong></>}
                            {cat !== 'All' && <> in <strong>{cat}</strong></>}
                        </span>
                        <button className="clear-search" onClick={() => {
                            if (onSearch) {
                                onSearch('', 'All');
                            }
                        }}>Clear filters</button>
                    </div>
                )}

                {/* ====== BEST SELLERS / MAIN GRID ====== */}
                <section className="home-section fade-in-up">
                    <div className="bestsellers-section">
                        <div className="section-header">
                            <h2>{isSearchActive ? 'Search Results' : 'Best Sellers'}</h2>
                            {!isSearchActive && <span className="section-link">See more</span>}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="home-empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try a different search term or browse our categories above.</p>
                            </div>
                        ) : (
                            <div className="bestsellers-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ====== TRENDING ====== */}
                {!isSearchActive && trendingProducts.length > 0 && (
                    <section className="home-section fade-in-up">
                        <div className="trending-section">
                            <div className="section-header">
                                <h2>🚀 Trending Now</h2>
                                <span className="section-link">See all trending</span>
                            </div>
                            <div className="trending-scroll-row">
                                {trendingProducts.map((product, idx) => (
                                    <div key={product.id} className="trending-card-wrapper" style={{ position: 'relative' }}>
                                        <span className="trending-rank">#{idx + 1} Trending</span>
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
