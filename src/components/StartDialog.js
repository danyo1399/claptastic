import React, { useEffect, useState } from "react";
import styled from "styled-components";

const dialogShownKey = "dialog_shown";

const Button = styled.button`
  margin-left: auto;
  margin-right: auto;
`;

export default function StartDialog() {
  const [showDialog, setShowDialog] = useState(false);

  function closeDialog() {
    setShowDialog(false);
    localStorage.setItem(dialogShownKey, "Y");
  }

  useEffect(() => {
    const dialogShown = localStorage.getItem(dialogShownKey);
    if (!dialogShown) {
      setShowDialog(true);
    }
  }, []);

  return (
    showDialog && (
      <div
        id="dialog"
        className="dialog-wrapper fixed top-0 w-full h-full flex justify-center items-center z-10"
      >
        <div className="dialog rounded m-6 p-6 text-lg md:w-2/3 z-10">
          <p className="mb-6">
            You ever tried clapping while holding your phone?
          </p>
          <p>Well now you can</p>
          <Button
            className="rounded p-2 text-md w-full bg-green-500 mt-8 text-white"
            onClick={closeDialog}
          >
            Close
          </Button>
        </div>
        <div className="dialog-bg inset-0 opacity-50 bg-white absolute"></div>
      </div>
    )
  );
}
