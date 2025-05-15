import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";

export default function Globe3D({ onCountryClick }) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, name: "", x: 0, y: 0 });

  // Load countries
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((res) => res.json())
      .then((data) => {
        const geoData = feature(data, data.objects.countries);
        setCountries(geoData.features);
      });
  }, []);

  // Setup globeconst geoData = feature(data, data.objects.countries);
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.camera().position.z = 300;

    const scene = globe.scene();
    scene.children = scene.children.filter((obj) => !obj.isLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
  }, []);

  // Handle hover
  const handleHover = (feat) => {
    setHovered(feat);

    setTooltip((prev) => ({
      ...prev,
      name: feat?.properties?.name || "",
      show: !!feat,
    }));

    if (globeRef.current) {
      globeRef.current.controls().autoRotate = !feat;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={(e) => {
        const bounds = containerRef.current.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        }));
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl={null}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={new THREE.MeshBasicMaterial({ color: "#FEFEFE" })}
        showAtmosphere={false}
        polygonsData={countries}
        polygonCapColor={(d) => (hovered === d ? "#A5C3D3" : "#D0E9F5")}
        polygonStrokeColor={() => "#FEFEFE"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonAltitude={() => 0.01}
        polygonLabel={() => ""}
        onPolygonHover={handleHover}
        onPolygonClick={(d) => onCountryClick(d?.properties?.name)}
        width={600}
        height={600}
      />

      {tooltip.show && (
        <div
          className="absolute text-xs px-2 py-0.5 bg-white/60 backdrop-blur-sm text-[#7A92A7]"
          style={{
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            pointerEvents: "none",
            zIndex: 20,
            border: "1px solid rgba(122, 146, 167, 0.2)",
            borderRadius: 0,
            lineHeight: 1.2,
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
