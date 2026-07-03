import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            unique: true,
            required: true
        },

        password: {
            type: String,
        },

        image: {
            type: String,
        },

        provider: {
            type: String,
            default: "credentials"
        }
    },
    {
        timestamps: true
    }
);

export default models.User || model("User", UserSchema);