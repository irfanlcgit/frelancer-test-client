import React from "react";
import { Button, Glyphicon } from "react-bootstrap";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={isLoading}
    {...props}
  >
    {isLoading}
    {!isLoading ? text : loadingText}
  </Button>;