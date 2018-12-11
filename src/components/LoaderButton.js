import React from "react";
//import { Button, Glyphicon } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading}
    {!isLoading ? text : loadingText}
  </Button>;