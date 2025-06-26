import { NavLink } from 'react-router-dom';
import './css/home.css';

// Import FontAwesome
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
    const token = localStorage.getItem('token');
    
    return (
        <div className='home container-x'>
            <div className="text1">
                <h1>Smart Stock Management: Optimize Your Inventory with Ease!</h1>
                <h2>Track, manage, and optimize your stock levels in real time. Reduce waste, prevent stockouts, and improve efficiency.</h2>
                <div className="buttons">
                    {token ? (
                        <NavLink className="btn learn-more center" to='/about'>
                            Learn More <FontAwesomeIcon icon={faArrowRight} />
                        </NavLink>
                    ) : (
                        <>
                            <NavLink className="btn get-started" to='/login'>
                                Get Started <FontAwesomeIcon icon={faArrowRight} />
                            </NavLink>
                            <NavLink className="btn learn-more" to='/about'>
                                Learn More <FontAwesomeIcon icon={faArrowRight} />
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
