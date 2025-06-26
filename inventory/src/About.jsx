import './css/about.css';
import Text from './Text';

function About() {
    return (
        <div className="container-x about">
            <Text title="About Us" Description="🌟 Revolutionizing Inventory Control with AI & Automation" />
            <div className="first">
                <p>
                    Managing stock efficiently is a major challenge for retail businesses, warehouses, and supermarkets. 
                    Our AI-powered stock management system provides real-time inventory tracking, demand forecasting, 
                    and automated supplier coordination, helping businesses make data-driven decisions and reduce inefficiencies.
                </p>
            </div>

            <Text title="What We Provide" Description="Our Services & Solutions" />
            <div className="row">
                <div className="about-content">
                    <h2>🎯 Our Mission</h2>
                    <p>To simplify stock management by leveraging AI for real-time tracking, automation, and forecasting.</p>
                </div>
                <div className="about-content">
                    <h2>👥 Our Team</h2>
                    <p>Experienced professionals and engineers dedicated to making inventory management smarter and easier.</p>
                </div>
                <div className="about-content">
                    <h2>🌟 Our Values</h2>
                    <p>Efficiency, innovation, and reliability – ensuring businesses reduce waste and optimize inventory.</p>
                </div>
            </div>

            <Text title="Why This Project?" Description="Solving Key Inventory Challenges" />
            <div className="row">
                <div className="about-content">
                    <h2>❌ Inaccurate Stock Tracking</h2>
                    <p>Businesses often struggle with outdated stock levels, leading to inefficiencies.</p>
                </div>
                <div className="about-content">
                    <h2>⚠️ Overstocking & Shortages</h2>
                    <p>Poor inventory control leads to excess or insufficient stock, affecting profitability.</p>
                </div>
                <div className="about-content">
                    <h2>📊 Lack of Demand Forecasting</h2>
                    <p>Without predictive analytics, companies cannot anticipate stock requirements accurately.</p>
                </div>
                <div className="about-content">
                    <h2>💰 High Operational Costs</h2>
                    <p>Manual processes and outdated systems increase labor and storage costs unnecessarily.</p>
                </div>
            </div>

            <Text title="🔹 Key Features" Description="Powerful Capabilities to Optimize Inventory Management" />
            <div className="row">
                <div className="about-content">
                    <h2>💡 Real-Time Inventory Monitoring</h2>
                    <p>Track stock levels live and receive automatic low-stock alerts.</p>
                </div>
                <div className="about-content">
                    <h2>📊 AI-Powered Demand Forecasting</h2>
                    <p>Predict future demand using machine learning algorithms.</p>
                </div>
                <div className="about-content">
                    <h2>📩 Automated Supplier Notifications</h2>
                    <p>Instantly notify suppliers when restocking is needed.</p>
                </div>
                <div className="about-content">
                    <h2>📈 Data-Driven Decision Making</h2>
                    <p>Get detailed sales and inventory analytics.</p>
                </div>
                <div className="about-content">
                    <h2>⚡ User-Friendly Dashboard</h2>
                    <p>Built with React.js & Django for seamless navigation.</p>
                </div>
            </div>

            <Text title="🔹 How It Works?" Description="5 Simple Steps for Smart Stock Management" />
            <div className="row">
                <div className="about-content">
                    <h2>1️⃣ Admin Logs In</h2>
                    <p>Secure access to the inventory management system.</p>
                </div>
                <div className="about-content">
                    <h2>2️⃣ Stock Updates</h2>
                    <p>Real-time stock monitoring and tracking.</p>
                </div>
                <div className="about-content">
                    <h2>3️⃣ AI Prediction Model</h2>
                    <p>Forecasts demand based on past sales & trends.</p>
                </div>
                <div className="about-content">
                    <h2>4️⃣ Automated Alerts</h2>
                    <p>Sends restocking notifications to suppliers.</p>
                </div>
                <div className="about-content">
                    <h2>5️⃣ Reports & Insights</h2>
                    <p>Generates reports for better decision-making.</p>
                </div>
            </div>

            <Text title="🔹 Technologies Used" Description="Modern Tech Stack for Maximum Efficiency" />
            <div className="row">
                <div className="about-content">
                    <h2>🖥 Frontend</h2>
                    <p>React.js for a smooth and real-time user experience.</p>
                </div>
                <div className="about-content">
                    <h2>⚙️ Backend</h2>
                    <p>Django for business logic and API handling.</p>
                </div>
                <div className="about-content">
                    <h2>📊 Machine Learning</h2>
                    <p>AI-based demand forecasting models.</p>
                </div>
                <div className="about-content">
                    <h2>🗄 Database</h2>
                    <p>MySQL for storing stock, sales, and supplier details.</p>
                </div>
            </div>

            <Text title="🔹 Benefits of Smart Stock Management" Description="Why Businesses Need This Solution" />
            <div className="row">
                <div className="about-content">
                    <h2>✔ Saves Time & Effort</h2>
                    <p>Automates stock tracking & supplier coordination.</p>
                </div>
                <div className="about-content">
                    <h2>✔ Reduces Waste & Overstocking</h2>
                    <p>AI-driven demand prediction prevents excess inventory.</p>
                </div>
                <div className="about-content">
                    <h2>✔ Minimizes Errors</h2>
                    <p>Eliminates manual mistakes in inventory tracking.</p>
                </div>
                <div className="about-content">
                    <h2>✔ Improves Business Growth</h2>
                    <p>Helps businesses make data-backed decisions.</p>
                </div>
            </div>

            <Text title="🔹 Who Can Use It?" Description="Industries That Benefit From Our System" />
            <div className="row">
                <div className="about-content">
                    <h2>🛒 Retail Businesses</h2>
                    <p>Prevent stock shortages and manage supply chains effectively.</p>
                </div>
                <div className="about-content">
                    <h2>🏭 Warehouses</h2>
                    <p>Track large inventory stocks efficiently.</p>
                </div>
                <div className="about-content">
                    <h2>📦 E-commerce Stores</h2>
                    <p>Maintain product availability and optimize stock flow.</p>
                </div>
                <div className="about-content">
                    <h2>🛍 Supermarkets</h2>
                    <p>Manage high-demand consumer goods seamlessly.</p>
                </div>
            </div>
        </div>
    );
}

export default About;
