import React from "react";
import { Link } from "wouter";

const SimpleHeader = () => {
  return (
    <div>
      <h1>Welcome to the Employee Page</h1>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default SimpleHeader;
