import React from "react";
import CatalogoHeader from "../../../components/client/catalogoMotos/CatalogoHeader";
import CatalogoGrid from "../../../components/client/catalogoMotos/CatalogoGrid";

const CatalogoMotos = () => {
  return (
    <div className="flex-1 py-10 lg:pl-8">
      <div className="flex flex-col gap-4">

        <CatalogoHeader />

        <CatalogoGrid />

      </div>
    </div>
  );
};

export default CatalogoMotos;
