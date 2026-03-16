export default interface IMessage {
    id:number;
    message:string;
    envoyeur:"user" | "bot";
}