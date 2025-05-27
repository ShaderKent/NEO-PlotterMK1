import type { Orbital_Data } from "./types";
const degToRad = Math.PI / 180;
const t = 2451545 * (24 * 60 * 60 * 1000); //January 1, 4713 BC ending on Jan 1 2000 at 12:00pm in seconds



const mercuryStaticData: Orbital_Data = {
    date: (2460915.0159722 * (24 * 60 * 60 * 1000)) - t, //J2000 = Number of milliseconds since January 1, 4713 BC ending on Jan 1 2000 at 12:00pm
    M: 252.25084,
    e: 0.20563069,
    a: 0.38709893,
    o: 48.33167 * degToRad,
    i: 7.00487 * degToRad,
    p: 77.45645 * degToRad,
    T: 87.968
  };
  const venusStaticData: Orbital_Data = {
    date: (2460726.1826389 * (24 * 60 * 60 * 1000)) - t, //j2000 in milliseconds
    M: 181.97973,
    e: 0.00677323,
    a: 0.72333199,
    o: 76.68069 * degToRad,
    i: 3.39471 * degToRad,
    p: 131.53298 * degToRad,
    T: 224.695
  };
  const earthStaticData: Orbital_Data = {
    date: (2460680.0611111 * (24 * 60 * 60 * 1000)) -t, //j2000 in milliseconds
    M: 100.46435,
    e: 0.01671022,
    a: 1.00000011,
    o: -11.26064 * degToRad,
    i: 0.00005 * degToRad,
    p: 102.94719 * degToRad,
    T: 365.4
  };
  const marsStaticData: Orbital_Data = {
    date: (2460928.0798611 * (24 * 60 * 60 * 1000)) - t, //j2000 in milliseconds
    M: 355.45332,
    e: 0.09341233,
    a: 1.52366231,
    o: 49.57854 * degToRad,
    i: 1.85061 * degToRad,
    p: 336.04084 * degToRad,
    T: 686.972
  };

  const planetStaticData = [
    mercuryStaticData,
    venusStaticData,
    earthStaticData,
    marsStaticData,
  ]

  export default planetStaticData;