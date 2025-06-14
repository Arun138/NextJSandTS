import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean
    message:string
    isAcceptingMessages?:boolean // its optional bcz it needed when sending the msg, but not needed in login, signups. 
    messages?:Array<Message> // same reason
}