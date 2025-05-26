export interface NEO_JSON_Object {
    id: number;
    neo_reference_id: number;
    name: string;
    designation: string;
    absolute_magnitude_h: number;
    is_potentially_hazardous_asteroid: boolean;
    nasa_jpl_url: string;
    estimated_diameter: {
      feet: {
        estimated_diameter_max: number;
        estimated_diameter_min: number;
      };
      kilometers: {
        estimated_diameter_max: number;
        estimated_diameter_min: number;
      };
      meters: {
        estimated_diameter_max: number;
        estimated_diameter_min: number;
      };
      miles: {
        estimated_diameter_max: number;
        estimated_diameter_min: number;
      };
    };
    orbital_data: {
      aphelion_distance: string;
      ascending_node_longitude: string;
      data_arc_in_days: number;
      eccentricity: string;
      epoch_osculation: string;
      equinox: string;
      first_observation_date: string;
      inclination: string;
      jupiter_tisserand_invariant: string;
      last_observation_date: string;
      mean_anomaly: string;
      mean_motion: string;
      minimum_orbit_intersection: string;
      observations_used: number;
      orbit_determination_date: string;
      orbit_id: string;
      orbit_uncertainty: string;
      orbital_period: string;
      perihelion_argument: string;
      perihelion_distance: string;
      perihelion_time: string;
      semi_major_axis: string;
      orbit_class: {
        orbit_class_type: string;
        orbit_class_description: string;
        orbit_class_range: string;
      };
    };
    close_approach_data: Array<Close_Approach_Data>;
    links: {
      self: string;
    };
  }
export interface Close_Approach_Data {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    orbiting_body: string;
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    relative_velocity: {
      kilometers_per_hour: string;
      kilometers_per_second: string;
      miles_per_hour: string;
    };
  }
export interface OrbitXYZ {
    x: Array<number>;
    y: Array<number>;
    z: Array<number>;
  }
export interface OrbitingBody {
    id: Number;
    name: string;
    OrbitingBody: string;
    hazard: Boolean;
    orbitalPeriod: Number; //days
    closeApproachDistance: Number; //km
    closeApproachRelSpeed: Number; //km/s
    closeApproachDate: string;
    closeApproachEpochDate: Number;
    EstDiameterMin: Number; //meters
    EstDiameterMax: Number; //meters
    firstObservation: String;
    lastObservation: String;
    orbitalData: Orbital_Data; 
}  

export interface Orbital_Data {
    date: number; //Date of perigee in epoch time (subtract j2000 to get usableT)
    M: number; //Mean Anomaly => How far around the orbit the object currently is in degrees. 0 at perihelion, 180 at aphelion
    e: number; //Eccentricity => How 'pointy' the orbit is: 0 = circular, < 1 = Elliptical, > 1 == Parabolic, > 1 = Hyperbolic
    a: number; //Length of the semi major axis (1/2 the distance between the periapsis and apoapsis)
    o: number; //'Omega'(Capital) or ascending node longitude => Angle at the point where the orbit ascending passes through the horizontal plane of the earth and sun, in deg (counterclockwise)
    i: number; //Inclination => // angle (deg) between the plane of the orbit and the reference plane > 0-90deg normal direction orbit > 90-180deg retrograde orbits
    p: number; //'omega'(lowecase) or perihelion argument => The angle between the ascending node and the periapsis (lowest point of orbit)
    T: number;
    orbit?: OrbitXYZ;
}

export interface PlanetDisplay {
  mercury: boolean,
  venus: boolean,
  earth: boolean,
  mars: boolean,
}

export interface API_Response_List_Data {
  absolute_magnitude_h: number, 
  close_approach_data: [
    {  
    close_approach_date_full: string,
    }
  ],
  estimated_diameter: {
    kilometers: object,
  },
  id: string, 
  is_potentially_hazardous_asteroid: Boolean, 
  is_sentry_object: Boolean, 
  links: object,
  name: string, 
  nasa_jpl_url: string, 
  neo_reference_id: string, 
}
  