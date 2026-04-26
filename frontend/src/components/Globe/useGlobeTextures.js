import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function useGlobeTextures() {
  const [dayMap, nightMap, normalMap, cloudsMap] = useLoader(
    TextureLoader,
    [
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
      "https://threejs.org/examples/textures/planets/earth_lights_2048.png",
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
      "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
    ]
  );

  return { dayMap, nightMap, normalMap, cloudsMap };
}