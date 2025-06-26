import { faLocation, faMailBulk, faMessage, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react"
import './css/contact.css'
import Text from './Text'

function Contact(){
    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "fb8cbc14-88a2-4cac-b790-e0680bd3962f");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

    return(
        <>
            <div className="container-x contact">
                <Text title="Contact US" Description="Say in Touch"/>
                <div className="center">
                    <div className="left">
                        <h2>Send us a message <FontAwesomeIcon icon={faMessage} /></h2>
                        <p>Feel free to reach out through contact form or find out contact information
                            below. Your feedback, questions, and suggestions are important to us as we strive to provide exceptional service to our university community.
                        </p>
                        <ul>
                            <li><FontAwesomeIcon className='icon' icon={faMailBulk}/> krishnabudumuru7@gmail.com </li>
                            <li><FontAwesomeIcon className='icon' icon = {faPhone} /> +91 9553220667 </li>
                            <li><FontAwesomeIcon className='icon' icon = {faLocation} />Rajeev Nagar, Yendada, Visakhapatnam - 530045</li>
                        </ul>
                    </div>
                    <div className="right">
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder='Enter your name'/>
                            <input type="tel" placeholder='Enter your mobile number'/>
                            <textarea name="message" rows="6" placeholder='Enter your message'></textarea>
                            <button type='submit' className='btns'>Submit now</button>
                        </form>
                        <span>{result}</span>
                    </div>
                </div>
            </div>
        </>
    )
} 
export default Contact