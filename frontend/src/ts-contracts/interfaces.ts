import { Dispatch, SetStateAction } from "react";
import Konva from 'konva';
import Tile from '../classes/Tile'

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

// Dice component
export interface PipFaceArgs {
    value: number;
    rolling: boolean;
}

//Modal Component
export interface ModalArgs {
    isVisible: boolean;
    setIsVisible: SetterFunction<boolean>;
    modalClassTypes: string;
    content: any;
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

// Resource requirements for buying
export interface ResourceRequirements {
    'Road': {[res: string]: number};
    'Settlement': {[res: string]: number};
    'City': {[res: string]: number};
    'DevelopmentCard': {[res: string]: number};
}

// MainPlayerInfo component args
export interface MainPlayerInfoArgs {
    id: string;
    position: string;
}

// Trade resource selection content
type handleConfirm = (e: ReactMouseEvent) => void
type handleBack = () => void

type TradeResourceSelectionButtonActionCallbacks = handleConfirm | handleBack

export interface ButtonInfo {
    text: string;
    type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    callback: TradeResourceSelectionButtonActionCallbacks;
}

export interface TradeResourceSelectionArgs {
    dialogueType: string;
    buttons: ButtonInfo[];
    giveTitle: string;
    receiveTitle: string;
    giveArray: string[]                  // TBC
}

// Board component
export interface ResourceColors {
  ORE: string;
  LUMBER: string;
  WOOL: string;
  BRICK: string;
  GRAIN: string;
  [key: string]: string;
}

// Game component
export interface GamePagePositions {
    [position: string]: string;
}

// Contexts
export interface Missions {
    longestRoad: string;
    setLongestRoad: SetterFunction<string>;
    largestArmy: string;
    setLargestArmy: SetterFunction<string>;
}

export interface WebsocketContextShape {
  // WebSocket
  sendJsonMessage: (data: SendJSONFormatObj) => void;
  setSocketURL: SetterFunction<SocketURL>;
  setShouldReconnect: SetterFunction<boolean>;

  // Lobby / connection
  lobbyInitialised: boolean;
  setLobbyInitialised: SetterFunction<boolean>;
  currentLobby: string;
  setCurrentLobby: SetterFunction<string>;
  setPlayerList: SetterFunction<PlayerNameColor[]>;

  // Player identity
  playerID: string;
  playerName: string;
  setPlayerName: SetterFunction<string>;

  // UI flags
  displayDice: boolean;
  setDisplayDice: SetterFunction<boolean>;
  moveRobber: boolean;
  setMoveRobber: SetterFunction<boolean>;
  stealCard: boolean;
  setStealCard: SetterFunction<boolean>;
  stealList: string[];

  // Game state
  players: PlayerState;
  setPlayers: SetterFunction<PlayerState>;
  turn: string;
  setTurn: SetterFunction<string>;
  tiles: TileData[];
  setTiles: SetterFunction<TileData[]>;
  paths: PathData[];
  setPaths: SetterFunction<PathData[]>;
  nodes: NodeData[];
  setNodes: SetterFunction<NodeData[]>;

  // Missions
  missions: Missions

}

export interface TradeContextShape {
    tradeModalIsVisible: boolean;
    setTradeModalIsVisible: SetterFunction<boolean>;
    marTradeModalIsVisible: boolean;
    setMarTradeModalIsVisible: SetterFunction<boolean>;
    playerTradeModalIsVisible: boolean;
    setPlayerTradeModalIsVisible: SetterFunction<boolean>;
}

export interface GameContextShape {
    resIcons: Record<'woodIcon' | 'brickIcon' | 'wheatIcon' | 'sheepIcon' | 'oreIcon', string>;
}

export interface ModalContextShape {
    isEnabled: boolean;
    setIsEnabled: SetterFunction<boolean>;
}

export interface StructuresArgs {
    tilesMasterArray: Tile[];
    tileRadius: number;
}