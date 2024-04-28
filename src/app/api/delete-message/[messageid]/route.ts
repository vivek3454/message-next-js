import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { useId } from "react";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
    const messageid = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        );
    }
    
    try {
        const updatedResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageid}}}
        );

        if (updatedResult.matchedCount  === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error while deleting message",error);
        
        return Response.json(
            {
                success: false,
                message: "Error while deleting message"
            },
            { status: 500 }
        );
    }
}