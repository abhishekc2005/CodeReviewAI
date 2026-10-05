const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      default: undefined,
    },
    mobile: {
      type: String,
      trim: true,
      sparse: true,
      default: undefined,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    resetPasswordTokenHash: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique sparse indexes — only index documents where the field exists and is not null
userSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { email: { $type: "string" } },
  }
);

userSchema.index(
  { mobile: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { mobile: { $type: "string" } },
  }
);

// Validate that at least one of email or mobile is provided
userSchema.pre("validate", function () {
  if (!this.email && !this.mobile) {
    throw new Error("At least one of email or mobile is required");
  }
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user data (never include password)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email || null,
    mobile: this.mobile || null,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
