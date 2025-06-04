import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export type TNode = {
    id:string
    coords : {
        lat:number,
        lng:number
    },
    name:string
}

export type TNoiseRecord = {
    id: string;
    tier: "NORMAL" | "TIER 1" | "TIER 2" | "TIER 3";
    soundLevel: number;
    duration: number;
    timestamp: Timestamp;
    type: "sustained" | "shortburst";
}

export type TNoiseRecordWithNode = TNoiseRecord & { node: TNode };
