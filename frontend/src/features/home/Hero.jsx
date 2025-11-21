import '../../assets/styles/App.css'; // Ensure styles are imported or use module CSS

const Hero = () => {
    return (
        <section className="hero">
            <h1>Welcome to <span className="gradient-text">Land Roys</span></h1>
            <p className="subtitle">Experience the premium design you were looking for.</p>
            <div className="cta-group">
                <button className="btn btn-primary">Get Started</button>
                <button className="btn btn-secondary">Learn More</button>
            </div>
        </section>
    );
};

export default Hero;
