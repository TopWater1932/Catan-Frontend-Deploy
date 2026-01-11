import { Dispatch, SetStateAction } from "react";
import Konva from 'konva';

// All setter functions
export type SetterFunction<T> = Dispatch<SetStateAction<T>>;

// Events
export type ReactMouseEvent = React.MouseEvent<HTMLElement>
export type ReactChangeEvent<T> = React.ChangeEvent<T>
export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>

// JS format object for sending JSON data
export interface SendJSONFormatObj {
    [key: string]: any;
}

// useState types for receving backend data
export interface PlayerStateData {
    [key: string]: any;             // TBC
}

export interface PlayerState {
    [key: string]: PlayerStateData;
}

export interface PlayerNameColor {
    name: string;
    color: string;
}

export interface TileData {
    [key: string]: any;             // TBC
}

export interface NodeData {
    [key: string]: any;             // TBC
}

export interface PathData {
    [key: string]: any;             // TBC
}

export interface Port {
  reqNumIn: number;
  reqTypeIn: string;
  vert: string[];
  text: string;
  x?: number;
  y?: number;
}

export interface PortsMap {
    [portID: string]: Port;
}

export interface Vertex extends Coordinates {  // To be superseded by Node class
    id: string;
    player: 'empty' | string;
    structure: 'empty' | string;
    port: 'none' | string;
}

// Options Page props
export type SocketURL = string | null

export interface OptionsPageProps {
    setSocketURL: SetterFunction<SocketURL>;
    serverMsgs: string[];
    setServerMsgs: SetterFunction<string[]>;
    playerColor: string;
    setPlayerColor: SetterFunction<string>;
    playerList: PlayerNameColor[];
}

// Props for server messages
export interface ServerMsgsWindowProps {
  messages: string[];
}

// useFetch utility hook
export type FetchCallback = () => Promise<void>

export interface useFetchArgs {
    url:string;
    method:string;
    info: SendJSONFormatObj;
    setServerMsgs: SetterFunction<string[]>;
}

export type useFetchReturns = [any,boolean,any, FetchCallback]

// Window resize util
export interface StageSize {
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

// Create card array util
export interface ResourcesMap {
    [resource: string]: number;
}

export interface DevCardsMap {
    [card: string]: number;
}

export interface PlayerStrucMap {
    [struc: string]: number;
}