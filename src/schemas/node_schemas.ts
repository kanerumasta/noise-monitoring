import { QueryDocumentSnapshot, Timestamp, GeoPoint } from "firebase/firestore";

export type TNode = {
    id:string
    coords : GeoPoint
    name:string
}

export type TNoiseRecord = {
    id: string;
    soundLevel: number;
    duration: number;
    timestamp: Timestamp;
    type: "sustained" | "shortburst";
}

export type TNoiseRecordWithNode = TNoiseRecord & { node: TNode };


// // Node data
// const nodes = [
//   // Filter Site Nodes
//   {
//     id: 1,
//     name: "Filter Site Node 1",
//     lat: 10.303263346925576,
//     lng: 123.86329442165102,
//     noiseLevel: "Normal",
//     noisePeak: 65,
//     noiseTier: 0,
//     consecutiveIntervals: 1,
//     location: "Filter Site",
//     timestamp: "2024-02-20 08:30:00"
//   },
//   {
//     id: 2,
//     name: "Filter Site Node 2",
//     lat: 10.303218626609574,
//     lng: 123.86352089049124,
//     noiseLevel: "Tier 1",
//     noisePeak: 75,
//     noiseTier: 2,
//     consecutiveIntervals: 3,  // 15 minutes (3 x 5-min intervals)
//     location: "Filter Site",
//     timestamp: "2024-02-20 08:15:00"
//   },
//   {
//     id: 3,
//     name: "Filter Site Node 3",
//     lat: 10.303186459360795,
//     lng: 123.86374895418248,
//     noiseLevel: "Tier 3",
//     noisePeak: 120,
//     noiseTier: 3,
//     consecutiveIntervals: 3,
//     location: "Filter Site",
//     timestamp: "2024-02-20 08:45:00"
//   },

//   // Sitio Tahna Nodes
//   {
//     id: 4,
//     name: "Tahna Node 1",
//     lat: 10.301850119811743,
//     lng: 123.86873049466762,
//     noiseLevel: "Tier 2",
//     noisePeak: 82,
//     noiseTier: 1,
//     consecutiveIntervals: 3,
//     location: "Sitio Tahna",
//     timestamp: "2024-02-20 08:10:00"
//   },
//   {
//     id: 5,
//     name: "Tahna Node 2",
//     lat: 10.301656155473276,
//     lng: 123.86880760817512,
//     noiseLevel: "Normal",
//     noisePeak: 68,
//     noiseTier: 0,
//     consecutiveIntervals: 1,
//     location: "Sitio Tahna",
//     timestamp: "2024-02 -20 08:35:00"
//   },
//   {
//     id: 6,
//     name: "Tahna Node 3",
//     lat: 10.301447016918546,
//     lng: 123.86883375971344,
//     noiseLevel: "Tier 1",
//     noisePeak: 73,
//     noiseTier: 1,
//     consecutiveIntervals: 3,
//     location: "Sitio Tahna",
//     timestamp: "2024-02-20 08:40:00"
//   },

//   // Sitio San Miguel Nodes
//   {
//     id: 7,
//     name: "San Miguel Node 1",
//     lat: 10.298220500473846,
//     lng: 123.86910419812594,
//     noiseLevel: "Tier 2",
//     noisePeak: 95,
//     noiseTier: 2,
//     consecutiveIntervals: 3,
//     location: "Sitio San Miguel",
//     timestamp: "2024-02-20 08:25:00"
//   },
//   {
//     id: 8,
//     name: "San Miguel Node 2",
//     lat: 10.29812542410282,
//     lng: 123.86891288419301,
//     noiseLevel: "Tier 1",
//     noisePeak: 83,
//     noiseTier: 1,
//     consecutiveIntervals: 3,
//     location: "Sitio San Miguel",
//     timestamp: "2024-02-20 08:05:00"
//   },
//   {
//     id: 9,
//     name: "San Miguel Node 3",
//     lat: 10.298087009399318,
//     lng: 123.86868740705779,
//     noiseLevel: "Normal",
//     noisePeak: 60,
//     noiseTier: 0,
//     consecutiveIntervals: 1,
//     location: "Sitio San Miguel",
//     timestamp: "2024-02-20 08:20:00"
//   },
// ]
