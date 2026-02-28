import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
       type:String,
       required:[true, 'Subscription name is required'],
       trim: true,
        minLength:2,
        maxLength:100,
    },
    price:{
        type: Number,
        required:[true, 'Subscription price is required'],
        min: [0, 'price must be greater than 0']
    },
    currency:{
        type: String,
        enum:['USD','EUR','AED','INR'],
        default: 'INR'
    },
    frequency:{
        type: String,
        enum: ['daily','weekly','monthly','yearly'],
        required:true
    },
    category:{
      type: String,
       enum:[ "news",
           "transport",
           "entertainment",
           "sports",
           "health",
           "education",
           "other"],
        required: true,
    },
    paymentMethod:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default: 'active'
    },
    startDate:{
        type: Date,
        required:true,
        validate: {
            validator: (value) => value <= new Date(),
            message:'Start date must be in the past',
        }
    },
    renewalDate:{
        type: Date,
        required:true,
        validate: {
            validator: function (value) {
              return  value > this.startDate
            },
            message:'renewal date must be after start date',
        },},
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

},{timestamps:true});
//auto calculate the date
subscriptionSchema.pre('validate', async function () {
    if (!this.renewalDate && this.startDate && this.frequency) {
        const date = new Date(this.startDate);

        if (this.frequency === 'monthly') {
            date.setMonth(date.getMonth() + 1);
        } else if (this.frequency === 'yearly') {
            date.setFullYear(date.getFullYear() + 1);
        } else {
            date.setDate(
                date.getDate() + (this.frequency === 'weekly' ? 7 : 1)
            );
        }

        this.renewalDate = date;
    }
});


const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

