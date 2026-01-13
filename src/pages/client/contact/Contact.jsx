import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ContactChannels from "../../../components/client/contact/ContactChannels";
import ContactFormSection from "../../../components/client/contact/ContactFormSection";
import ContactHero from "../../../components/client/contact/ContactHero";
import "../../../styles/contact/ContactPage.css";

const Contact = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
  }, [hash]);

  return (
    <div className="contact-page">
      <ContactHero />
      <ContactChannels />
      <ContactFormSection />
    </div>
  );
};

export default Contact;