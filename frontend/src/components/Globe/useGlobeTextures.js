import { useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";
import React from "react";

const TEXTURE_URLS = {
  day: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg",
  night: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_lights_2048.png",
  normal: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg",
  specular: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png",
};

export default function useGlobeTextures() {
  const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [
      TEXTURE_URLS.day,
      TEXTURE_URLS.night,
      TEXTURE_URLS.normal,
      TEXTURE_URLS.specular,
      TEXTURE_URLS.clouds,
    ]
  );

  dayMap.colorSpace = SRGBColorSpace;
  nightMap.colorSpace = SRGBColorSpace;

  dayMap.anisotropy = 16;
  normalMap.anisotropy = 16;

  return { dayMap, nightMap, normalMap, specularMap, cloudsMap };
}