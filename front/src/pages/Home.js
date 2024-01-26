import React, { useEffect, useState } from "react";

import { GoPrimitiveSquare } from "react-icons/go";

function Home({ isVendorName }) {
  const [welcomeUser, setWelcomeUser] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  let userDesc = localStorage.getItem("userDesc");

  useEffect(() => {
    setWelcomeUser(userDesc);
  }, [welcomeUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://app.portal.kedifap.com/public/announcements.json");
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchData();
  }, []);

  const renderedAnnoucements = announcements.map((announce, index) => (
    <div className="flex items-center py-3" key={index}>
      <GoPrimitiveSquare className="bg-kedifapgreen-300 text-kedifapgreen-300 mr-4 shadow-top rounded" />
      {announce.title}
    </div>
  ));

  return (
    <>
      <div>
        <h1 className="text-2xl py-4">Welcome {welcomeUser}</h1>
      </div>
      {isVendorName == "" && (
        <div>
          <h1 className="text-2xl py-4">Ανακοινώσεις</h1>
          <div>{renderedAnnoucements}</div>
        </div>
      )}
    </>
  );
}

export default Home;
