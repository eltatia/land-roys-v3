import React from "react";
import CatalogoHeader from "../../components/catalogoMotos/CatalogoHeader";
import CatalogoGrid from "../../components/catalogoMotos/CatalogoGrid";

const CatalogoMotos = () => {
  return (
    <main className="flex-1 py-10 lg:pl-8">
      <div className="flex flex-col gap-4">

        <CatalogoHeader />

        <CatalogoGrid />

      </div>
    </main>
  );
};

export default CatalogoMotos;
