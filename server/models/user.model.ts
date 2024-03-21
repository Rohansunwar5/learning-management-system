import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from 'bcryptjs';
import { Mode } from "fs";

const emailRegexPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export interface IUser extends Document{
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id : string;
    url: string;
  },
  role: string;
  isVerified: boolean;
  courses: Array <{courseId: string}>;
  comparePassword: (password: string) => Promise<boolean>;  
}

const userSchema : Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your mail"],
    unique: true,
    validate: {
      validator: function (value: string){
        return emailRegexPattern.test(value); // test() examines the regular expression weather it matches with the value or not
      },
      message:"please enter a valid email "
    },
  },
  password: {
    type:String,
    required:[true, "Please provide a password"],
    minlength: [6, "Password must be atleast 6 characters"],
    select: false //hides the password field
  },
  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: String,
    }
  ],


},{timestamps: true });

//Hash Password before saving

userSchema.pre<IUser>("save",async function (next){
  if(!this.isModified('password')){ // checking
    next(); 
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

//compare password
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean>{ // Promise<boolean>: for explicitely returning the value as true or false, if not stated it could have taken it as Promise<any> or Promise <unkown> which could have lead to error or ambiguity in the code 
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;